"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getExportData } from "@/app/actions/export";

interface ExportDataProps {
  username?: string;
}

export default function ExportData({ username }: ExportDataProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Generating your financial report...");

    try {
      const data = await getExportData();
      const {
        username: serverUsername,
        transactions = [],
        goals = [],
        totalBalance = 0,
        monthlyIncome = 0,
        monthlyExpenses = 0,
        savingsRate = 0,
      } = data;

      // Prefer server-resolved username over prop
      const finalUsername = serverUsername || username || "User";

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // App Dark Theme Palette
      const BRAND_PRIMARY = { r: 59, g: 130, b: 246 };
      const TEXT_DARK = { r: 15, g: 23, b: 42 };
      const TEXT_MUTED = { r: 100, g: 116, b: 139 };
      const BG_SUMMARY = { r: 248, g: 250, b: 252 };
      const BORDER_LIGHT = { r: 226, g: 232, b: 240 };

      // Logo/Favicon
      try {
        const img = new window.Image();
        img.src = "/favicon.ico";
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        doc.addImage(img, "PNG", 40, 25, 30, 30);
      } catch {
        // Logo skipped safely
      }

      // Header Text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
      doc.text(`${finalUsername}'s Financial Summary`, 80, 44);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
      doc.text("Personal Financial Ledger Report", 80, 58);

      // Metadata
      const rightAlignX = 555;
      doc.setFontSize(9);
      doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);
      doc.text(
        `Generated: ${new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`,
        rightAlignX,
        42,
        { align: "right" }
      );
      doc.text(`Account User: ${finalUsername}`, rightAlignX, 55, {
        align: "right",
      });

      // Divider Line
      doc.setDrawColor(BORDER_LIGHT.r, BORDER_LIGHT.g, BORDER_LIGHT.b);
      doc.setLineWidth(1);
      doc.line(40, 75, 555, 75);

      // Metric Summary Box
      doc.setFillColor(BG_SUMMARY.r, BG_SUMMARY.g, BG_SUMMARY.b);
      doc.setDrawColor(BORDER_LIGHT.r, BORDER_LIGHT.g, BORDER_LIGHT.b);
      doc.roundedRect(40, 90, 515, 52, 6, 6, "FD");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
      doc.text("NET BALANCE", 60, 108);
      doc.text("MONTHLY INCOME", 185, 108);
      doc.text("MONTHLY EXPENSES", 320, 108);
      doc.text("SAVINGS RATE", 460, 108);

      doc.setFontSize(11);
      doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);
      doc.text(`$${Number(totalBalance).toFixed(2)}`, 60, 127);

      doc.setTextColor(16, 185, 129);
      doc.text(`+$${Number(monthlyIncome).toFixed(2)}`, 185, 127);

      doc.setTextColor(239, 68, 68);
      doc.text(`-$${Number(monthlyExpenses).toFixed(2)}`, 320, 127);

      doc.setTextColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
      doc.text(`${savingsRate.toFixed(1)}%`, 460, 127);

      // Section 1: Transactions Table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);
      doc.text("Transaction History", 40, 170);

      const tableData = transactions.map((t: any) => {
        const txType = String(t.type || "Expense").toLowerCase();
        const isIncome = txType === "income";
        const formattedAmount = `${isIncome ? "+" : "-"}$${Math.abs(Number(t.amount || 0)).toFixed(2)}`;

        return [
          t.date ? new Date(t.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }) : "N/A",
          t.description || "N/A",
          t.categoryName || "Uncategorized",
          isIncome ? "Income" : "Expense",
          formattedAmount,
        ];
      });

      autoTable(doc, {
        startY: 180,
        margin: { left: 40, right: 40 },
        head: [["Date", "Description", "Classification", "Type", "Amount"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [51, 65, 85],
        },
        columnStyles: {
          3: { fontStyle: "italic" },
          4: { halign: "right", fontStyle: "bold" },
        },
        didParseCell: (cellData) => {
          if (cellData.section === "body" && cellData.column.index === 4) {
            const rawVal = String(cellData.cell.raw || "");
            if (rawVal.startsWith("+")) {
              cellData.cell.styles.textColor = [16, 185, 129];
            } else {
              cellData.cell.styles.textColor = [239, 68, 68];
            }
          }
        },
      });

      // Section 2: Goals Table
      const finalY = (doc as any).lastAutoTable?.finalY || 200;

      if (goals && goals.length > 0) {
        const goalsTitleY = finalY + 35;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);
        doc.text("Financial Goals Progress", 40, goalsTitleY);

        const goalsTableData = goals.map((g: any) => {
          const current = Number(g.currentAmount || 0);
          const target = Number(g.targetAmount || 0);
          const progress = target > 0 ? ((current / target) * 100).toFixed(1) : "0.0";

          return [
            g.name || "Goal",
            g.targetDate ? new Date(g.targetDate).toLocaleDateString() : "N/A",
            `$${current.toFixed(2)}`,
            `$${target.toFixed(2)}`,
            `${progress}%`,
          ];
        });

        autoTable(doc, {
          startY: goalsTitleY + 12,
          margin: { left: 40, right: 40 },
          head: [["Goal Name", "Target Date", "Saved", "Target", "Progress"]],
          body: goalsTableData,
          theme: "striped",
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
          bodyStyles: { fontSize: 8.5, textColor: [51, 65, 85] },
          columnStyles: {
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right", fontStyle: "bold" },
          },
        });
      }

      // Page Footers
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
        doc.text(
          `Page ${i} of ${totalPages}`,
          doc.internal.pageSize.getWidth() - 40,
          doc.internal.pageSize.getHeight() - 20,
          { align: "right" }
        );
      }

      doc.save(
        `${finalUsername.toLowerCase().replace(/\s+/g, "_")}_financial_report_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );

      toast.success("Financial report exported successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to export financial report.",
        { id: toastId }
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExportPDF}
      disabled={isExporting}
      className="flex items-center gap-2 h-10 px-3.5 py-2 text-xs font-medium text-foreground bg-[#0a0f1d] hover:bg-accent/50 border border-border rounded-xl shadow-xs transition-all duration-200 outline-none cursor-pointer disabled:opacity-50"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      ) : (
        <Download className="w-4 h-4 text-muted-foreground" />
      )}
      <span>{isExporting ? "Exporting..." : "Export Data"}</span>
    </button>
  );
}