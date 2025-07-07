import { TrailerSegment } from '../shared/models/trailer-segment.model';

export class TrailerParser {
    public parse(text: string): TrailerSegment[] {
        const segments: TrailerSegment[] = [];
        const trailerRegex = /\[TRAILER\]([\s\S]*?)\[\/TRAILER\]/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = trailerRegex.exec(text)) !== null) {
            const preText: string = text.slice(lastIndex, match.index);
            if (preText) {
                segments.push({ type: 'text', html: this.convertLinks(preText) });
            }
            const inner: string = match[1].trim();
            const { url, title } = this.extractTrailerInfo(inner);
            if (url) {
                segments.push({ type: 'trailer', url, title });
            }
            lastIndex = match.index + match[0].length;
        }

        const remaining: string = text.slice(lastIndex);
        if (remaining) {
            segments.push({ type: 'text', html: this.convertLinks(remaining) });
        }

        return segments;
    }

    private extractTrailerInfo(content: string): { url: string; title?: string } {
        const mdLink: RegExpExecArray | null = /\[(.*?)\]\((https?:\/\/[^)]+)\)/.exec(content);
        if (mdLink) {
            const title: string = content.replace(mdLink[0], '').trim();
            return { url: mdLink[2], title: title || undefined };
        }

        const urlMatch: RegExpExecArray | null = /(https?:\/\/\S+)/.exec(content);
        const url: string = urlMatch ? urlMatch[1] : '';
        const title: string = content.replace(url, '').trim();
        return { url, title: title || undefined };
    }

    private convertLinks(text: string): string {
        return text
            .replace(/\n/g, '<br>')
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    }
}
