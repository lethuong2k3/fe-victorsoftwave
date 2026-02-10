package com.victor.softwave.controller;

import com.victor.softwave.model.WebDesignContent;
import com.victor.softwave.repository.WebDesignContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/pages/web-design")
public class WebDesignContentController {

        @Autowired
        private WebDesignContentRepository webDesignContentRepository;

        @GetMapping
        public ResponseEntity<WebDesignContent> getContent(
                        @RequestParam(value = "lang", required = false) String lang) {
                List<WebDesignContent> all = webDesignContentRepository.findAll();
                if (all.isEmpty()) {
                        WebDesignContent empty = new WebDesignContent();
                        empty.setHeroTitlePrefix("Giải Pháp Thiết Kế Website");
                        empty.setHeroTitleHighlight("Chuyên Nghiệp");
                        empty.setHeroDescription(
                                        "Website chuẩn SEO, giao diện độc quyền UX/UI, tương thích mọi thiết bị di động. Chúng tôi tạo ra những website không chỉ đẹp mà còn hiệu quả trong việc chuyển đổi khách hàng.");
                        empty.setHeroTitlePrefixEn("Website Design Solutions");
                        empty.setHeroTitleHighlightEn("Professional");
                        empty.setHeroDescriptionEn(
                                        "SEO-friendly websites with unique UX/UI, fully responsive across devices. We build websites that are not only beautiful but also drive real conversions.");
                        String defaultHtml = "<p>Chúng tôi thiết kế và phát triển website theo mục tiêu kinh doanh của bạn: đẹp, nhanh, chuẩn SEO và tối ưu chuyển đổi. Từ website giới thiệu, landing page đến website doanh nghiệp, mọi hạng mục đều được xây dựng với cấu trúc rõ ràng, trải nghiệm người dùng tốt và dễ quản trị.</p>"
                                        + "<p>Trọng tâm của chúng tôi là kết hợp UX/UI hiện đại với hiệu năng và SEO kỹ thuật, giúp website vừa \"đẹp để xem\" vừa \"mạnh để bán\".</p>";
                        empty.setServiceDescriptionHtml(defaultHtml);
                        String defaultHtmlEn = "<p>We design and develop websites based on your business goals: fast, SEO-ready, and conversion-focused. From landing pages to company websites, every project is built with clear structure, great UX, and easy content management.</p>"
                                        + "<p>Our core is combining modern UX/UI with performance and technical SEO, so your website is both beautiful and effective.</p>";
                        empty.setServiceDescriptionHtmlEn(defaultHtmlEn);
                        empty.setSuitableFor(String.join("\n",
                                        "Doanh nghiệp cần website chuyên nghiệp để xây dựng thương hiệu",
                                        "Chủ shop/đơn vị bán hàng muốn tăng chuyển đổi từ Google và quảng cáo",
                                        "Dự án cần landing page triển khai nhanh, đo lường rõ ràng",
                                        "Website hiện tại cần nâng cấp giao diện và tối ưu tốc độ"));
                        empty.setSuitableForEn(String.join("\n",
                                        "Businesses needing a professional website to build brand trust",
                                        "Online shops aiming to increase conversions from Google and ads",
                                        "Projects requiring fast landing pages with clear tracking",
                                        "Existing websites that need a redesign and speed optimization"));
                        empty.setSuggestionText(
                                        "Nếu bạn đang chạy quảng cáo, hãy ưu tiên Landing Page để tối ưu chuyển đổi và đo lường. Nếu cần xây dựng thương hiệu dài hạn, Website doanh nghiệp chuẩn SEO sẽ mang lại hiệu quả bền vững.");
                        empty.setSuggestionTextEn(
                                        "If you run ads, prioritize a Landing Page for better conversion and tracking. For long-term branding, an SEO-ready business website delivers sustainable growth.");
                        empty.setSeoTitle("Thiết kế Website | Victor Software");
                        empty.setSeoKeywords(
                                        "thiết kế website, website chuẩn SEO, thiết kế landing page, thiết kế website doanh nghiệp");
                        empty.setSeoDescription(
                                        "Dịch vụ thiết kế website chuyên nghiệp: giao diện độc quyền UX/UI, tốc độ nhanh, chuẩn SEO, tối ưu chuyển đổi. Tư vấn & triển khai trọn gói.");
                        empty.setPrimaryKeyword("thiết kế website");
                        empty.setSeoTitleEn("Website Design | Victor Software");
                        empty.setSeoKeywordsEn(
                                        "website design, SEO-friendly website, landing page design, business website");
                        empty.setSeoDescriptionEn(
                                        "Professional website design services: unique UX/UI, fast performance, SEO-ready, conversion-focused. Consultation and full delivery.");
                        empty.setPrimaryKeywordEn("website design");
                        return ResponseEntity.ok()
                                        .header("Content-Language",
                                                        lang != null && lang.equalsIgnoreCase("en") ? "en" : "vi")
                                        .body(empty);
                }
                WebDesignContent current = all.get(0);
                if (current.getServiceDescriptionHtml() == null || current.getServiceDescriptionHtml().isBlank()) {
                        String intro = current.getServiceIntro() != null ? current.getServiceIntro() : "";
                        String secondary = current.getServiceSecondary() != null ? current.getServiceSecondary() : "";
                        current.setServiceDescriptionHtml("<p>" + intro + "</p><p>" + secondary + "</p>");
                        webDesignContentRepository.save(current);
                }

                if (current.getServiceDescriptionHtmlEn() == null)
                        current.setServiceDescriptionHtmlEn("");
                if (current.getHeroTitlePrefixEn() == null)
                        current.setHeroTitlePrefixEn("");
                if (current.getHeroTitleHighlightEn() == null)
                        current.setHeroTitleHighlightEn("");
                if (current.getHeroDescriptionEn() == null)
                        current.setHeroDescriptionEn("");
                if (current.getSuitableForEn() == null)
                        current.setSuitableForEn("");
                if (current.getSuggestionTextEn() == null)
                        current.setSuggestionTextEn("");
                if (current.getSeoTitle() == null)
                        current.setSeoTitle("");
                if (current.getSeoKeywords() == null)
                        current.setSeoKeywords("");
                if (current.getSeoDescription() == null)
                        current.setSeoDescription("");
                if (current.getPrimaryKeyword() == null)
                        current.setPrimaryKeyword("");
                if (current.getSeoTitleEn() == null)
                        current.setSeoTitleEn("");
                if (current.getSeoKeywordsEn() == null)
                        current.setSeoKeywordsEn("");
                if (current.getSeoDescriptionEn() == null)
                        current.setSeoDescriptionEn("");
                if (current.getPrimaryKeywordEn() == null)
                        current.setPrimaryKeywordEn("");
                if (current.getPricingJsonVi() == null)
                        current.setPricingJsonVi("");
                if (current.getPricingJsonEn() == null)
                        current.setPricingJsonEn("");

                return ResponseEntity.ok()
                                .header("Content-Language", lang != null && lang.equalsIgnoreCase("en") ? "en" : "vi")
                                .body(current);
        }

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<WebDesignContent> saveContent(@RequestBody @NonNull WebDesignContent request) {
                List<WebDesignContent> all = webDesignContentRepository.findAll();
                if (!all.isEmpty()) {
                        request.setId(all.get(0).getId());
                } else {
                        request.setId(null);
                }
                if (request.getServiceDescriptionHtml() == null || request.getServiceDescriptionHtml().isBlank()) {
                        String intro = request.getServiceIntro() != null ? request.getServiceIntro() : "";
                        String secondary = request.getServiceSecondary() != null ? request.getServiceSecondary() : "";
                        request.setServiceDescriptionHtml("<p>" + intro + "</p><p>" + secondary + "</p>");
                }
                request.setServiceIntro(null);
                request.setServiceSecondary(null);
                WebDesignContent saved = webDesignContentRepository.save(request);
                return ResponseEntity.ok(saved);
        }
}
