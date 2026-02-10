package com.victor.softwave.controller;

import com.victor.softwave.model.SeoOverallContent;
import com.victor.softwave.repository.SeoOverallContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/pages/seo-overall")
public class SeoOverallContentController {

    @Autowired
    private SeoOverallContentRepository seoOverallContentRepository;

    @GetMapping
    public ResponseEntity<SeoOverallContent> getContent(@RequestParam(value = "lang", required = false) String lang) {
        List<SeoOverallContent> all = seoOverallContentRepository.findAll();
        if (all.isEmpty()) {
            SeoOverallContent empty = new SeoOverallContent();
            empty.setHeroTitlePrefix("Dịch vụ SEO Tổng Thể");
            empty.setHeroTitleHighlight("Tăng trưởng bền vững");
            empty.setHeroDescription(
                    "Dịch vụ SEO tổng thể tập trung vào tăng trưởng bền vững, giúp website đạt thứ hạng cao và mang về lead chất lượng từ Google.");
            empty.setHeroTitlePrefixEn("SEO Full-Service");
            empty.setHeroTitleHighlightEn("Sustainable Growth");
            empty.setHeroDescriptionEn(
                    "Full-service SEO focused on sustainable growth, helping your website rank higher and bring qualified leads from Google.");
            String defaultHtml = "<p>SEO tổng thể không chỉ dừng ở vài từ khóa đơn lẻ, mà là một chiến lược dài hạn để tối ưu toàn bộ website: cấu trúc, nội dung, kỹ thuật và trải nghiệm người dùng.</p>"
                    + "<p>Chúng tôi xây dựng lộ trình SEO rõ ràng theo từng giai đoạn, kết hợp với đo lường và tối ưu liên tục để đảm bảo hiệu quả bền vững.</p>";
            empty.setServiceDescriptionHtml(defaultHtml);
            String defaultHtmlEn = "<p>Full-service SEO goes beyond a few isolated keywords. It is a long-term strategy to optimize your entire website: structure, content, technical SEO, and user experience.</p>"
                    + "<p>We create a clear SEO roadmap by phases, combined with continuous tracking and optimization to deliver sustainable results.</p>";
            empty.setServiceDescriptionHtmlEn(defaultHtmlEn);
            empty.setSuitableFor(String.join("\n",
                    "Doanh nghiệp muốn tăng lead bền vững từ Google",
                    "Website đã chạy quảng cáo nhưng traffic tự nhiên còn thấp",
                    "Dự án cần xây thương hiệu lâu dài trên kênh tìm kiếm",
                    "Đội marketing cần một đối tác SEO đồng hành chiến lược"));
            empty.setSuitableForEn(String.join("\n",
                    "Businesses aiming for sustainable leads from Google",
                    "Websites running ads but having low organic traffic",
                    "Projects that need long-term brand building on search",
                    "Marketing teams needing a strategic SEO partner"));
            empty.setSuggestionText(
                    "Nếu website chưa tối ưu kỹ thuật, hãy ưu tiên audit và xử lý nền tảng trước khi đẩy mạnh nội dung và backlink.");
            empty.setSuggestionTextEn(
                    "If your website is not technically optimized, prioritize a full audit and technical fixes before scaling content and backlinks.");
            empty.setSeoTitle("Dịch vụ SEO Tổng Thể | Victor Software");
            empty.setSeoKeywords("dịch vụ seo tổng thể, seo tổng thể, seo doanh nghiệp, chiến lược seo");
            empty.setSeoDescription(
                    "Dịch vụ SEO tổng thể giúp doanh nghiệp tăng trưởng bền vững từ Google: audit kỹ thuật, tối ưu onpage, xây dựng nội dung và chiến lược backlink an toàn.");
            empty.setPrimaryKeyword("dịch vụ seo tổng thể");
            empty.setSeoTitleEn("Full-Service SEO | Victor Software");
            empty.setSeoKeywordsEn("full-service seo, enterprise seo, seo strategy, seo agency");
            empty.setSeoDescriptionEn(
                    "Full-service SEO for sustainable growth: technical audit, on-page optimization, content strategy, and safe backlink building.");
            empty.setPrimaryKeywordEn("full-service seo");
            return ResponseEntity.ok()
                    .header("Content-Language", lang != null && lang.equalsIgnoreCase("en") ? "en" : "vi")
                    .body(empty);
        }
        SeoOverallContent current = all.get(0);
        if (current.getServiceDescriptionHtml() == null || current.getServiceDescriptionHtml().isBlank()) {
            String intro = current.getServiceIntro() != null ? current.getServiceIntro() : "";
            String secondary = current.getServiceSecondary() != null ? current.getServiceSecondary() : "";
            current.setServiceDescriptionHtml("<p>" + intro + "</p><p>" + secondary + "</p>");
            seoOverallContentRepository.save(current);
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
        return ResponseEntity.ok()
                .header("Content-Language", lang != null && lang.equalsIgnoreCase("en") ? "en" : "vi")
                .body(current);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SeoOverallContent> saveContent(@RequestBody @NonNull SeoOverallContent request) {
        List<SeoOverallContent> all = seoOverallContentRepository.findAll();
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
        SeoOverallContent saved = seoOverallContentRepository.save(request);
        return ResponseEntity.ok(saved);
    }
}
