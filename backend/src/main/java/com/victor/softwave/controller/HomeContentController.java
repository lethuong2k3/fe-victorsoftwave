package com.victor.softwave.controller;

import com.victor.softwave.model.HomeContent;
import com.victor.softwave.repository.HomeContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import jakarta.validation.Valid;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/pages/home")
public class HomeContentController {

    @Autowired
    private HomeContentRepository homeContentRepository;

    @GetMapping
    public ResponseEntity<HomeContent> getContent(@RequestParam(value = "lang", required = false) String lang) {
        List<HomeContent> all = homeContentRepository.findAll();
        if (all.isEmpty()) {
            HomeContent empty = new HomeContent();
            // Default Vietnamese
            empty.setBadgeText("#1 Đơn vị thiết kế Web & Marketing uy tín");
            empty.setTitlePrefix("Nâng tầm");
            empty.setTitleHighlight("Thương Hiệu Số");
            empty.setTitleSuffix("của bạn.");
            empty.setDescription(
                    "Victor Software cung cấp giải pháp thiết kế website chuyên nghiệp, tối ưu SEO và các chiến dịch Marketing hiệu quả giúp doanh nghiệp bứt phá doanh thu.");
            empty.setCtaPrimaryText("Bắt đầu ngay");
            empty.setCtaSecondaryText("Xem dự án");
            empty.setBenefit1("Tối ưu hóa SEO");
            empty.setBenefit2("Giao diện độc quyền");
            empty.setBenefit3("Hỗ trợ 24/7");
            empty.setHeroImageUrl("");
            empty.setSeoTitle("");
            empty.setSeoDescription("");
            empty.setSeoKeywords("");
            empty.setPrimaryKeyword("");

            // Services Defaults
            empty.setServicesTitle("Dịch vụ của chúng tôi");
            empty.setServicesDescription(
                    "Giải pháp công nghệ toàn diện giúp doanh nghiệp của bạn vận hành hiệu quả và tăng trưởng mạnh mẽ trên môi trường số.");

            // Marketing Defaults
            empty.setMarketingBadge("Digital Marketing");
            empty.setMarketingTitle("Bùng nổ doanh số đa nền tảng");
            empty.setMarketingCtaText("Xem báo giá chi tiết");

            // Marketing Platforms Defaults (VI)
            empty.setMarketingPlatformsJsonVi(
                    "[{\"key\":\"tiktok\",\"title\":\"TikTok Ads\",\"description\":\"Tiếp cận hàng triệu khách hàng trẻ với video ngắn sáng tạo và viral.\",\"imageUrl\":\"\"},{\"key\":\"facebook\",\"title\":\"Facebook Ads\",\"description\":\"Target đối tượng chuẩn xác, tối ưu chi phí chuyển đổi.\",\"imageUrl\":\"\"},{\"key\":\"google\",\"title\":\"Google Ads\",\"description\":\"Xuất hiện ngay khi khách hàng tìm kiếm.\",\"imageUrl\":\"\"}]");

            // Portfolio Defaults
            empty.setPortfolioTitle("Dự án tiêu biểu");
            empty.setPortfolioDescription("Hơn 500+ khách hàng đã tin tưởng và đồng hành cùng Victor Software.");

            // Blog Defaults
            empty.setBlogTitle("Kiến thức & Tin tức");
            empty.setBlogViewAllText("Xem tất cả bài viết");

            // Contact Defaults
            empty.setContactTitle("Liên hệ với chúng tôi");
            empty.setContactDescription(
                    "Đừng ngần ngại chia sẻ ý tưởng của bạn. Chúng tôi ở đây để biến nó thành hiện thực.");
            empty.setContactHotlineLabel("Hotline");
            empty.setContactEmailLabel("Email");
            empty.setContactAddressLabel("Địa chỉ");
            empty.setContactAddressValue("Tầng 12, Tòa nhà Bitexco, Q1, TP.HCM");
            empty.setContactHotline("0912 345 678");
            empty.setContactEmail("contact@victorsoftware.com");
            empty.setContactMapUrl(
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5132741062075!2d106.7017555152602!3d10.771915392324629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2sBitexco%20Financial%20Tower!5e0!3m2!1sen!2s!4v1645431652882!5m2!1sen!2s");

            // Default English
            empty.setBadgeTextEn("#1 Prestigious Web Design & Marketing Agency");
            empty.setTitlePrefixEn("Elevate Your");
            empty.setTitleHighlightEn("Digital Brand");
            empty.setTitleSuffixEn("Today.");
            empty.setDescriptionEn(
                    "Victor Software provides professional web design solutions, SEO optimization, and effective marketing campaigns to help businesses breakthrough in revenue.");
            empty.setCtaPrimaryTextEn("Get Started");
            empty.setCtaSecondaryTextEn("View Projects");
            empty.setBenefit1En("SEO Optimized");
            empty.setBenefit2En("Unique Design");
            empty.setBenefit3En("24/7 Support");
            empty.setHeroImageUrlEn("");
            empty.setSeoTitleEn("");
            empty.setSeoDescriptionEn("");
            empty.setSeoKeywordsEn("");
            empty.setPrimaryKeywordEn("");

            // Services Defaults En
            empty.setServicesTitleEn("Our Services");
            empty.setServicesDescriptionEn(
                    "Comprehensive technology solutions to help your business operate efficiently and grow strongly in the digital environment.");

            // Marketing Defaults En
            empty.setMarketingBadgeEn("Digital Marketing");
            empty.setMarketingTitleEn("Explode Sales Across Platforms");
            empty.setMarketingCtaTextEn("Get Detailed Quote");

            // Marketing Platforms Defaults (EN)
            empty.setMarketingPlatformsJsonEn(
                    "[{\"key\":\"tiktok\",\"title\":\"TikTok Ads\",\"description\":\"Reach millions of young customers with creative, viral short videos.\",\"imageUrl\":\"\"},{\"key\":\"facebook\",\"title\":\"Facebook Ads\",\"description\":\"Precisely target audiences and optimize conversion costs.\",\"imageUrl\":\"\"},{\"key\":\"google\",\"title\":\"Google Ads\",\"description\":\"Appear right when customers search for your services.\",\"imageUrl\":\"\"}]");

            // Portfolio Defaults En
            empty.setPortfolioTitleEn("Featured Projects");
            empty.setPortfolioDescriptionEn("Over 500+ clients have trusted and accompanied Victor Software.");

            // Blog Defaults En
            empty.setBlogTitleEn("Knowledge & News");
            empty.setBlogViewAllTextEn("View All Posts");

            // Contact Defaults En
            empty.setContactTitleEn("Contact Us");
            empty.setContactDescriptionEn("Don't hesitate to share your ideas. We are here to make them a reality.");
            empty.setContactHotlineLabelEn("Hotline");
            empty.setContactEmailLabelEn("Email");
            empty.setContactAddressLabelEn("Address");
            empty.setContactAddressValueEn("12th Floor, Bitexco Financial Tower, D1, HCMC");

            return ResponseEntity.ok()
                    .header("Content-Language", lang != null && lang.equalsIgnoreCase("en") ? "en" : "vi")
                    .header("Cache-Control", "no-store, no-cache, must-revalidate")
                    .header("Pragma", "no-cache")
                    .body(empty);
        }
        HomeContent current = all.get(0);

        // Ensure Vietnamese defaults if fields are missing/blank
        if (current.getBadgeText() == null || current.getBadgeText().isBlank())
            current.setBadgeText("#1 Đơn vị thiết kế Web & Marketing uy tín");
        if (current.getTitlePrefix() == null || current.getTitlePrefix().isBlank())
            current.setTitlePrefix("Nâng tầm");
        if (current.getTitleHighlight() == null || current.getTitleHighlight().isBlank())
            current.setTitleHighlight("Thương Hiệu Số");
        if (current.getTitleSuffix() == null || current.getTitleSuffix().isBlank())
            current.setTitleSuffix("của bạn.");
        if (current.getDescription() == null || current.getDescription().isBlank())
            current.setDescription(
                    "Victor Software cung cấp giải pháp thiết kế website chuyên nghiệp, tối ưu SEO và các chiến dịch Marketing hiệu quả giúp doanh nghiệp bứt phá doanh thu.");
        if (current.getCtaPrimaryText() == null || current.getCtaPrimaryText().isBlank())
            current.setCtaPrimaryText("Bắt đầu ngay");
        if (current.getCtaSecondaryText() == null || current.getCtaSecondaryText().isBlank())
            current.setCtaSecondaryText("Xem dự án");
        if (current.getBenefit1() == null || current.getBenefit1().isBlank())
            current.setBenefit1("Tối ưu hóa SEO");
        if (current.getBenefit2() == null || current.getBenefit2().isBlank())
            current.setBenefit2("Giao diện độc quyền");
        if (current.getBenefit3() == null || current.getBenefit3().isBlank())
            current.setBenefit3("Hỗ trợ 24/7");
        if (current.getServicesTitle() == null || current.getServicesTitle().isBlank())
            current.setServicesTitle("Dịch vụ của chúng tôi");
        if (current.getServicesDescription() == null || current.getServicesDescription().isBlank())
            current.setServicesDescription(
                    "Giải pháp công nghệ toàn diện giúp doanh nghiệp của bạn vận hành hiệu quả và tăng trưởng mạnh mẽ trên môi trường số.");
        if (current.getMarketingBadge() == null || current.getMarketingBadge().isBlank())
            current.setMarketingBadge("Digital Marketing");
        if (current.getMarketingTitle() == null || current.getMarketingTitle().isBlank())
            current.setMarketingTitle("Bùng nổ doanh số đa nền tảng");
        if (current.getMarketingCtaText() == null || current.getMarketingCtaText().isBlank())
            current.setMarketingCtaText("Xem báo giá chi tiết");
        if (current.getPortfolioTitle() == null || current.getPortfolioTitle().isBlank())
            current.setPortfolioTitle("Dự án tiêu biểu");
        if (current.getPortfolioDescription() == null || current.getPortfolioDescription().isBlank())
            current.setPortfolioDescription("Hơn 500+ khách hàng đã tin tưởng và đồng hành cùng Victor Software.");
        if (current.getBlogTitle() == null || current.getBlogTitle().isBlank())
            current.setBlogTitle("Kiến thức & Tin tức");
        if (current.getBlogViewAllText() == null || current.getBlogViewAllText().isBlank())
            current.setBlogViewAllText("Xem tất cả bài viết");
        if (current.getContactTitle() == null || current.getContactTitle().isBlank())
            current.setContactTitle("Liên hệ với chúng tôi");
        if (current.getContactDescription() == null || current.getContactDescription().isBlank())
            current.setContactDescription(
                    "Đừng ngần ngại chia sẻ ý tưởng của bạn. Chúng tôi ở đây để biến nó thành hiện thực.");
        if (current.getContactHotlineLabel() == null || current.getContactHotlineLabel().isBlank())
            current.setContactHotlineLabel("Hotline");
        if (current.getContactEmailLabel() == null || current.getContactEmailLabel().isBlank())
            current.setContactEmailLabel("Email");
        if (current.getContactAddressLabel() == null || current.getContactAddressLabel().isBlank())
            current.setContactAddressLabel("Địa chỉ");
        if (current.getContactAddressValue() == null || current.getContactAddressValue().isBlank())
            current.setContactAddressValue("Tầng 12, Tòa nhà Bitexco, Q1, TP.HCM");

        // Ensure non-null fields for English if added later
        if (current.getBadgeTextEn() == null)
            current.setBadgeTextEn("");
        if (current.getTitlePrefixEn() == null)
            current.setTitlePrefixEn("");
        if (current.getTitleHighlightEn() == null)
            current.setTitleHighlightEn("");
        if (current.getTitleSuffixEn() == null)
            current.setTitleSuffixEn("");
        if (current.getDescriptionEn() == null)
            current.setDescriptionEn("");
        if (current.getCtaPrimaryTextEn() == null)
            current.setCtaPrimaryTextEn("");
        if (current.getCtaSecondaryTextEn() == null)
            current.setCtaSecondaryTextEn("");
        if (current.getBenefit1En() == null)
            current.setBenefit1En("");
        if (current.getBenefit2En() == null)
            current.setBenefit2En("");
        if (current.getBenefit3En() == null)
            current.setBenefit3En("");

        if (current.getHeroImageUrl() == null)
            current.setHeroImageUrl("");
        if (current.getSeoTitle() == null)
            current.setSeoTitle("");
        if (current.getSeoDescription() == null)
            current.setSeoDescription("");
        if (current.getSeoKeywords() == null)
            current.setSeoKeywords("");
        if (current.getPrimaryKeyword() == null)
            current.setPrimaryKeyword("");

        if (current.getHeroImageUrlEn() == null)
            current.setHeroImageUrlEn("");
        if (current.getSeoTitleEn() == null)
            current.setSeoTitleEn("");
        if (current.getSeoDescriptionEn() == null)
            current.setSeoDescriptionEn("");
        if (current.getSeoKeywordsEn() == null)
            current.setSeoKeywordsEn("");
        if (current.getPrimaryKeywordEn() == null)
            current.setPrimaryKeywordEn("");

        if (current.getServicesTitleEn() == null)
            current.setServicesTitleEn("");
        if (current.getServicesDescriptionEn() == null)
            current.setServicesDescriptionEn("");

        if (current.getMarketingBadgeEn() == null)
            current.setMarketingBadgeEn("");
        if (current.getMarketingTitleEn() == null)
            current.setMarketingTitleEn("");
        if (current.getMarketingCtaTextEn() == null)
            current.setMarketingCtaTextEn("");

        if (current.getMarketingPlatformsJsonVi() == null)
            current.setMarketingPlatformsJsonVi("[]");
        if (current.getMarketingPlatformsJsonEn() == null)
            current.setMarketingPlatformsJsonEn("[]");

        if (current.getPortfolioTitleEn() == null)
            current.setPortfolioTitleEn("");
        if (current.getPortfolioDescriptionEn() == null)
            current.setPortfolioDescriptionEn("");

        if (current.getBlogTitleEn() == null)
            current.setBlogTitleEn("");
        if (current.getBlogViewAllTextEn() == null)
            current.setBlogViewAllTextEn("");

        if (current.getContactTitleEn() == null)
            current.setContactTitleEn("");
        if (current.getContactDescriptionEn() == null)
            current.setContactDescriptionEn("");
        if (current.getContactHotlineLabelEn() == null)
            current.setContactHotlineLabelEn("");
        if (current.getContactEmailLabelEn() == null)
            current.setContactEmailLabelEn("");
        if (current.getContactAddressLabelEn() == null)
            current.setContactAddressLabelEn("");
        if (current.getContactAddressValueEn() == null)
            current.setContactAddressValueEn("");

        if (current.getContactHotline() == null)
            current.setContactHotline("0912 345 678");
        if (current.getContactEmail() == null)
            current.setContactEmail("contact@victorsoftware.com");

        if (current.getZaloUrl() == null)
            current.setZaloUrl("");
        if (current.getFacebookUrl() == null)
            current.setFacebookUrl("");
        if (current.getMessengerUrl() == null)
            current.setMessengerUrl("");
        if (current.getAdminChatUrl() == null)
            current.setAdminChatUrl("");

        return ResponseEntity.ok()
                .header("Content-Language", lang != null && lang.equalsIgnoreCase("en") ? "en" : "vi")
                .header("Cache-Control", "no-store, no-cache, must-revalidate")
                .header("Pragma", "no-cache")
                .body(current);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<HomeContent> saveContent(@Valid @RequestBody @NonNull HomeContent request) {
        List<HomeContent> all = homeContentRepository.findAll();
        if (!all.isEmpty()) {
            request.setId(all.get(0).getId());
        } else {
            request.setId(null);
        }
        HomeContent saved = homeContentRepository.save(request);
        return ResponseEntity.ok()
                .header("Cache-Control", "no-store, no-cache, must-revalidate")
                .header("Pragma", "no-cache")
                .body(saved);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(errors);
    }
}
