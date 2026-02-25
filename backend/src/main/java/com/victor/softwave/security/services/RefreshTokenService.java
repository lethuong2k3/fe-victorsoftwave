package com.victor.softwave.security.services;

import com.victor.softwave.exception.TokenRefreshException;
import com.victor.softwave.model.RefreshToken;
import com.victor.softwave.repository.RefreshTokenRepository;
import com.victor.softwave.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
  @Value("${JWT_REFRESH_EXPIRATION_MS}")
  private Long refreshTokenDurationMs;

  @Autowired
  private RefreshTokenRepository refreshTokenRepository;

  @Autowired
  private UserRepository userRepository;

  public Optional<RefreshToken> findByToken(@NonNull String token) {
    return refreshTokenRepository.findByToken(token);
  }

  public RefreshToken createRefreshToken(@NonNull Long userId) {
    var user = userRepository.findById(userId).orElseThrow();
    var newTokenValue = UUID.randomUUID().toString();
    var expiry = Instant.now().plusMillis(refreshTokenDurationMs);

    // If user already has a refresh token, update it to avoid unique constraint on
    // user_id
    Optional<RefreshToken> existing = refreshTokenRepository.findByUser(user);
    if (existing.isPresent()) {
      RefreshToken rt = existing.get();
      rt.setToken(newTokenValue);
      rt.setExpiryDate(expiry);
      return refreshTokenRepository.save(rt);
    }

    RefreshToken refreshToken = new RefreshToken();
    refreshToken.setUser(user);
    refreshToken.setExpiryDate(expiry);
    refreshToken.setToken(newTokenValue);
    return refreshTokenRepository.save(refreshToken);
  }

  public RefreshToken verifyExpiration(@NonNull RefreshToken token) {
    if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
      refreshTokenRepository.delete(token);
      throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
    }

    return token;
  }

  @Transactional
  public int deleteByUserId(@NonNull Long userId) {
    return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
  }

  @Transactional
  public void deleteByToken(@NonNull String token) {
    refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
  }
}
