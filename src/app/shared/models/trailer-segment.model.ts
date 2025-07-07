export interface TrailerSegment {
    type: 'text' | 'trailer';
    html?: string;
    url?: string;
    title?: string;
}
