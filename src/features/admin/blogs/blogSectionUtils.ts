import { BlogSection } from '@/shared/types';

let idSeq = 0;

export function createBlogEditorId(prefix: 'sec' | 'blk'): string {
  idSeq += 1;
  return `${prefix}-${Date.now()}-${idSeq}`;
}

export function sectionsToMarkdown(sections: BlogSection[]): string {
  return sections
    .map((sec) => {
      const header = sec.sectionTitle ? `## ${sec.sectionTitle}\n` : '';
      const body = sec.blocks
        .map((b) =>
          b.type === 'heading'
            ? `${b.level === 3 ? '###' : '##'} ${b.content}`
            : b.type === 'image'
              ? `![${b.caption || ''}](${b.content})`
              : b.type === 'quote'
                ? `> ${b.content}`
                : b.content,
        )
        .join('\n\n');
      return `${header}${body}`;
    })
    .join('\n\n---\n\n');
}
