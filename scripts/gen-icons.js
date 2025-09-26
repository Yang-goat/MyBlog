import fs from "fs";
import * as solid from "@fortawesome/free-solid-svg-icons";

// 过滤掉非 icon 导出
function getIconNames(pkg) {
  return Object.keys(pkg)
    .filter((key) => key.startsWith("fa"))
    .map((key) => pkg[key].iconName)
    .sort();
}

const solidIcons = getIconNames(solid);

function genSection(title, icons) {
  // 去重并排序
  const uniqueIcons = Array.from(new Set(icons)).sort();

  // 每个单元格内容
  const cells = uniqueIcons.map(
    (name) => `<VPIcon icon="${name}" /> \`${name}\``
  );

  // 组装成行（4列）
  const rows = [];
  for (let i = 0; i < cells.length; i += 4) {
    rows.push(
      `| ${cells.slice(i, i + 4).join(" | ")} |`
    );
  }

  // 表头（4列）
  const header = `| 图标 | 图标 | 图标 | 图标 |\n|------|------|------|------|`;

  return `## ${title}\n\n${header}\n${rows.join("\n")}\n`;
}

const mdContent = `---
date: 2025-09-26
icon: toolbox
category:
  - 测试
---

# 图标大全

${genSection("Solid 图标", solidIcons)}

<Comment />

<script setup>
import Comment from "@Comment";
</script>
`;

fs.writeFileSync("src/功能测试/icons.md", mdContent, "utf-8");
console.log("✅ 已生成 src/功能测试/icons.md");
