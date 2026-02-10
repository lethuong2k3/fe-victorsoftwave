package com.victor.softwave.service;

import com.victor.softwave.model.Client;
import com.victor.softwave.model.Project;
import com.victor.softwave.payload.request.QuoteItem;
import com.victor.softwave.payload.request.QuoteRequest;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelService {

    public ByteArrayInputStream exportProjectsToExcel(@NonNull List<Project> projects) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Projects");

            // --- STYLES ---
            // Title Style
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 16);
            titleFont.setColor(IndexedColors.DARK_BLUE.getIndex());
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            // Subtitle Style
            CellStyle subtitleStyle = workbook.createCellStyle();
            Font subtitleFont = workbook.createFont();
            subtitleFont.setItalic(true);
            subtitleFont.setColor(IndexedColors.GREY_50_PERCENT.getIndex());
            subtitleStyle.setFont(subtitleFont);
            subtitleStyle.setAlignment(HorizontalAlignment.CENTER);

            // Header Style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Data Style (Bordered)
            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Data Style (Center Aligned)
            CellStyle centerDataStyle = workbook.createCellStyle();
            centerDataStyle.cloneStyleFrom(dataStyle);
            centerDataStyle.setAlignment(HorizontalAlignment.CENTER);

            // --- CONTENT ---

            // Title Row
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("DANH SÁCH DỰ ÁN / PROJECT LIST");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));

            // Company Name / Date
            Row infoRow = sheet.createRow(1);
            Cell infoCell = infoRow.createCell(0);
            infoCell.setCellValue("Victor Softwave - Export Date: "
                    + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            infoCell.setCellStyle(subtitleStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 6));

            // Header Row
            String[] headers = { "ID", "Tên Dự Án / Name", "Khách Hàng / Client", "Danh Mục / Category",
                    "Trạng Thái / Status", "Mức Độ / Priority", "Ngày Hoàn Thành / Date" };
            Row headerRow = sheet.createRow(3);
            headerRow.setHeightInPoints(25); // Taller header

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data Rows
            int rowIdx = 4;
            for (Project project : projects) {
                Row row = sheet.createRow(rowIdx++);
                row.setHeightInPoints(20); // Slightly taller rows

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(project.getId() != null ? project.getId().toString() : "");
                cell0.setCellStyle(centerDataStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(project.getTitle() != null ? project.getTitle() : "");
                cell1.setCellStyle(dataStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(project.getClient() != null ? project.getClient() : "");
                cell2.setCellStyle(dataStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(project.getCat() != null ? project.getCat() : "");
                cell3.setCellStyle(centerDataStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(project.getStatus() != null ? project.getStatus() : "");
                cell4.setCellStyle(centerDataStyle);

                Cell cell5 = row.createCell(5);
                cell5.setCellValue(project.getPriority() != null ? project.getPriority() : "");
                cell5.setCellStyle(centerDataStyle);

                Cell cell6 = row.createCell(6);
                cell6.setCellValue(project.getCompletionDate() != null ? project.getCompletionDate() : "");
                cell6.setCellStyle(centerDataStyle);
            }

            // Auto Size Columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                // Add some extra padding to columns
                int currentWidth = sheet.getColumnWidth(i);
                sheet.setColumnWidth(i, currentWidth + 1000);
            }

            // Add AutoFilter
            sheet.setAutoFilter(new CellRangeAddress(3, rowIdx - 1, 0, headers.length - 1));

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Fail to import data to Excel file: " + e.getMessage());
        }
    }

    public ByteArrayInputStream exportClientsToExcel(@NonNull List<Client> clients) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Clients");

            // --- STYLES ---
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 16);
            titleFont.setColor(IndexedColors.DARK_BLUE.getIndex());
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle subtitleStyle = workbook.createCellStyle();
            Font subtitleFont = workbook.createFont();
            subtitleFont.setItalic(true);
            subtitleFont.setColor(IndexedColors.GREY_50_PERCENT.getIndex());
            subtitleStyle.setFont(subtitleFont);
            subtitleStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle centerDataStyle = workbook.createCellStyle();
            centerDataStyle.cloneStyleFrom(dataStyle);
            centerDataStyle.setAlignment(HorizontalAlignment.CENTER);

            // --- CONTENT ---
            // Title
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("DANH SÁCH KHÁCH HÀNG / CLIENT LIST");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));

            // Info
            Row infoRow = sheet.createRow(1);
            Cell infoCell = infoRow.createCell(0);
            infoCell.setCellValue("Victor Softwave - Export Date: "
                    + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            infoCell.setCellStyle(subtitleStyle);
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 6));

            // Header
            String[] headers = { "ID", "Tên Khách Hàng / Name", "Danh Mục / Category", "Website Link",
                    "Trạng Thái / Status", "Mức Độ / Priority", "Nổi Bật / Featured" };
            Row headerRow = sheet.createRow(3);
            headerRow.setHeightInPoints(25);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data
            int rowIdx = 4;
            for (Client client : clients) {
                Row row = sheet.createRow(rowIdx++);
                row.setHeightInPoints(20);

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(client.getId());
                cell0.setCellStyle(centerDataStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(client.getName());
                cell1.setCellStyle(dataStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(client.getCategory() != null ? client.getCategory() : "");
                cell2.setCellStyle(centerDataStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(client.getLink() != null ? client.getLink() : "");
                cell3.setCellStyle(dataStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(client.getStatus() != null ? client.getStatus() : "Active");
                cell4.setCellStyle(centerDataStyle);

                Cell cell5 = row.createCell(5);
                cell5.setCellValue(client.getPriority() != null ? client.getPriority() : "Medium");
                cell5.setCellStyle(centerDataStyle);

                Cell cell6 = row.createCell(6);
                cell6.setCellValue(Boolean.TRUE.equals(client.getFeatured()) ? "Yes" : "No");
                cell6.setCellStyle(centerDataStyle);
            }

            // Auto Size Columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                // Add some padding
                int currentWidth = sheet.getColumnWidth(i);
                sheet.setColumnWidth(i, currentWidth + 2500);
            }

            // Auto Filter
            sheet.setAutoFilter(new CellRangeAddress(3, rowIdx - 1, 0, headers.length - 1));

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Fail to import data to Excel file: " + e.getMessage());
        }
    }

    public ByteArrayInputStream generateQuote(@NonNull QuoteRequest request) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Báo giá");

            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 26);
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle boldStyle = workbook.createCellStyle();
            Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            boldStyle.setFont(boldFont);

            CellStyle currencyStyle = workbook.createCellStyle();
            DataFormat format = workbook.createDataFormat();
            currencyStyle.setDataFormat(format.getFormat("#,##0"));
            currencyStyle.setAlignment(HorizontalAlignment.RIGHT);

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);
            dataStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Title
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(request.getLanguage().equals("en") ? "WEBSITE QUOTATION" : "BÁO GIÁ");
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 7));

            // Company Info (left block) + Date (right block)
            int rowNum = 2;
            Row companyLine1 = sheet.createRow(rowNum++);
            companyLine1.createCell(0).setCellValue(request.getLanguage().equals("en")
                    ? "VICTOR SOFTWAVE CO., LTD"
                    : "CÔNG TY TNHH VICTOR SOFTWAVE");
            sheet.addMergedRegion(new CellRangeAddress(companyLine1.getRowNum(), companyLine1.getRowNum(), 0, 4));
            Cell dateLabel = companyLine1.createCell(6);
            dateLabel.setCellValue(request.getLanguage().equals("en") ? "Date:" : "Ngày:");
            Cell dateValue = companyLine1.createCell(7);
            dateValue.setCellValue(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

            Row companyLine2 = sheet.createRow(rowNum++);
            companyLine2.createCell(0).setCellValue(request.getLanguage().equals("en")
                    ? "Address: Ho Chi Minh City"
                    : "Địa chỉ: TP. Hồ Chí Minh");
            sheet.addMergedRegion(new CellRangeAddress(companyLine2.getRowNum(), companyLine2.getRowNum(), 0, 4));
            Cell validLabel = companyLine2.createCell(6);
            validLabel.setCellValue(request.getLanguage().equals("en") ? "Valid until:" : "Hiệu lực đến:");
            Cell validValue = companyLine2.createCell(7);
            validValue.setCellValue(LocalDate.now().plusDays(30).format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

            Row companyLine3 = sheet.createRow(rowNum++);
            companyLine3.createCell(0).setCellValue(request.getLanguage().equals("en")
                    ? "Phone: 09xx xxx xxx"
                    : "Điện thoại: 09xx xxx xxx");
            sheet.addMergedRegion(new CellRangeAddress(companyLine3.getRowNum(), companyLine3.getRowNum(), 0, 4));

            // Customer Info
            rowNum++;
            Row customerHeader = sheet.createRow(rowNum++);
            customerHeader.createCell(0).setCellValue(request.getLanguage().equals("en") ? "Dear:" : "Kính gửi:");
            String toName = request.getCompanyName() != null && !request.getCompanyName().isEmpty()
                    ? request.getCompanyName()
                    : (request.getCustomerName() != null ? request.getCustomerName() : "");
            customerHeader.createCell(1).setCellValue(toName);
            sheet.addMergedRegion(new CellRangeAddress(customerHeader.getRowNum(), customerHeader.getRowNum(), 1, 7));

            if (request.getCompanyName() != null && !request.getCompanyName().isEmpty()) {
                Row r = sheet.createRow(rowNum++);
                r.createCell(0).setCellValue(request.getLanguage().equals("en") ? "Company:" : "Công ty:");
                r.createCell(1).setCellValue(request.getCompanyName());
            }
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                Row r = sheet.createRow(rowNum++);
                r.createCell(0).setCellValue("Email:");
                r.createCell(1).setCellValue(request.getEmail());
            }
            if (request.getPhone() != null && !request.getPhone().isEmpty()) {
                Row r = sheet.createRow(rowNum++);
                r.createCell(0).setCellValue(request.getLanguage().equals("en") ? "Phone:" : "Điện thoại:");
                r.createCell(1).setCellValue(request.getPhone());
            }

            // Table Header
            rowNum += 2;
            Row headerRow = sheet.createRow(rowNum++);
            String[] headers = request.getLanguage().equals("en")
                    ? new String[] { "No", "Item", "Description", "Unit", "Qty", "Unit Price (VND)", "Amount (VND)",
                            "Note" }
                    : new String[] { "STT", "Hạng mục", "Mô tả", "ĐVT", "SL", "Đơn giá (VND)", "Thành tiền (VND)",
                            "Ghi chú" };

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Items
            double totalAmount = 0;
            if (request.getItems() != null) {
                int idx = 1;
                for (QuoteItem item : request.getItems()) {
                    Row row = sheet.createRow(rowNum++);
                    Cell c0 = row.createCell(0);
                    c0.setCellValue(idx++);
                    c0.setCellStyle(dataStyle);

                    Cell c1 = row.createCell(1);
                    c1.setCellValue(request.getLanguage().equals("en") ? "Website Package" : "Gói website");
                    c1.setCellStyle(dataStyle);

                    Cell c2 = row.createCell(2);
                    c2.setCellValue(item.getDescription());
                    c2.setCellStyle(dataStyle);

                    Cell c3 = row.createCell(3);
                    c3.setCellValue(request.getLanguage().equals("en") ? "Package" : "Gói");
                    c3.setCellStyle(dataStyle);

                    Cell c4 = row.createCell(4);
                    c4.setCellValue(item.getQuantity());
                    c4.setCellStyle(dataStyle);

                    Cell priceCell = row.createCell(5);
                    priceCell.setCellValue(item.getUnitPrice());
                    priceCell.setCellStyle(currencyStyle);
                    priceCell.setCellStyle(dataStyle);

                    Cell totalCell = row.createCell(6);
                    double lineTotal = item.getTotal();
                    totalCell.setCellValue(lineTotal);
                    totalCell.setCellStyle(currencyStyle);
                    totalCell.setCellStyle(dataStyle);

                    Cell noteCell = row.createCell(7);
                    noteCell.setCellValue("");
                    noteCell.setCellStyle(dataStyle);

                    totalAmount += lineTotal;
                }
            }

            // Total
            rowNum++;
            Row totalRow = sheet.createRow(rowNum);
            Cell totalLabel = totalRow.createCell(5);
            totalLabel.setCellValue(request.getLanguage().equals("en") ? "Total:" : "Tổng cộng:");
            totalLabel.setCellStyle(boldStyle);
            Cell totalValue = totalRow.createCell(6);
            totalValue.setCellValue(totalAmount);
            totalValue.setCellStyle(currencyStyle);

            // Note
            if (request.getNote() != null && !request.getNote().isEmpty()) {
                rowNum += 2;
                Row noteHeader = sheet.createRow(rowNum++);
                noteHeader.createCell(0).setCellValue(request.getLanguage().equals("en") ? "Note:" : "Ghi chú:");
                Row noteRow = sheet.createRow(rowNum++);
                noteRow.createCell(0).setCellValue(request.getNote());
            }

            sheet.setColumnWidth(0, 6 * 256); // STT
            sheet.setColumnWidth(1, 18 * 256); // Hạng mục
            sheet.setColumnWidth(2, 40 * 256); // Mô tả
            sheet.setColumnWidth(3, 10 * 256); // ĐVT
            sheet.setColumnWidth(4, 10 * 256); // SL
            sheet.setColumnWidth(5, 18 * 256); // Đơn giá
            sheet.setColumnWidth(6, 20 * 256); // Thành tiền
            sheet.setColumnWidth(7, 20 * 256); // Ghi chú

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Fail to generate quote Excel file: " + e.getMessage());
        }
    }
}
