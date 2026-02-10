package com.victor.softwave.controller;

import com.victor.softwave.exception.TokenRefreshException;
import com.victor.softwave.model.RefreshToken;
import com.victor.softwave.payload.request.LoginRequest;
import com.victor.softwave.payload.request.TokenRefreshRequest;
import com.victor.softwave.payload.response.JwtResponse;
import com.victor.softwave.payload.response.TokenRefreshResponse;
import com.victor.softwave.repository.RoleRepository;
import com.victor.softwave.repository.UserRepository;
import com.victor.softwave.security.jwt.JwtUtils;
import com.victor.softwave.security.services.RefreshTokenService;
import com.victor.softwave.security.services.UserDetailsImpl;
import java.util.Objects;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  RefreshTokenService refreshTokenService;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

    String jwt = jwtUtils.generateTokenFromUsername(userDetails.getUsername());

    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    RefreshToken refreshToken = refreshTokenService.createRefreshToken(Objects.requireNonNull(userDetails.getId()));

    return ResponseEntity.ok(new JwtResponse(jwt,
        refreshToken.getToken(),
        userDetails.getId(),
        userDetails.getUsername(),
        userDetails.getEmail(),
        roles));
  }

  @PostMapping("/refreshtoken")
  public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
    String requestRefreshToken = request.getRefreshToken();

    return refreshTokenService.findByToken(Objects.requireNonNull(requestRefreshToken))
        .map(refreshTokenService::verifyExpiration)
        .map(RefreshToken::getUser)
        .map(user -> {
          String token = jwtUtils.generateTokenFromUsername(user.getUsername());
          return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
        })
        .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
            "Refresh token is not in database!"));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(@Valid @RequestBody TokenRefreshRequest request) {
    refreshTokenService.deleteByToken(Objects.requireNonNull(request.getRefreshToken()));
    return ResponseEntity.ok().build();
  }
}
