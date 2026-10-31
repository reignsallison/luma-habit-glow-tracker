import { describe, expect, it } from 'vitest';
import { getRouter } from '@/router';
import { sitemapStaticPaths, sitemapXML } from '@/lib/sitemap';

describe('Public sitemap', () => {
  it('includes the public homepage and excludes personal trackers and account flows', () => {
    const paths = sitemapStaticPaths(getRouter());
    expect(paths).toEqual(['/']);
    for (const path of ['/habits', '/intake', '/stats', '/auth']) expect(paths).not.toContain(path);
  });
  it('uses the public origin without fabricated last-modified dates', () => {
    const xml = sitemapXML('https://luma-habit-glow-tracker.lovable.app', [{ path: '/' }]);
    expect(xml).toContain('<loc>https://luma-habit-glow-tracker.lovable.app/</loc>');
    expect(xml).not.toContain('<lastmod>');
  });
});
