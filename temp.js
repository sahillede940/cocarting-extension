import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function fetchReducedHTML(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        const html = await response.text();

        // Load the HTML into Cheerio
        const $ = cheerio.load(html);

        // Remove all <script>, <style>, <iframe>, and comments
        $('script, style, iframe').remove();
        $('*').contents().each(function() {
            if (this.type === 'comment') {
                $(this).remove();
            }
        });

        // Remove unnecessary tags like meta, link, form, nav, footer, etc.
        $('meta, link, img, form, nav, footer, header').remove();

        // Remove all attributes except 'id' and 'class'
        $('*').each(function () {
            const keepAttributes = ['id', 'class'];
            const attributes = $(this).attr();
            for (const attr in attributes) {
                if (!keepAttributes.includes(attr)) {
                    $(this).removeAttr(attr);  // Remove all attributes except 'id' and 'class'
                }
            }
        });

        // Return the cleaned HTML with 'id' and 'class' retained
        const cleanedHTML = $.html();

        return cleanedHTML;
    } catch (err) {
        if (err.name === 'AbortError') {
            console.error('Fetch request timed out');
        } else {
            console.error('Fetch failed:', err);
        }
    } finally {
        clearTimeout(timeoutId);
    }
}

let url = "https://www.amazon.in/ASUS-Vivobook-i5-12500H-Laptop-X1502ZA-EJ541WS/dp/B0C7H6SSC8";
fetchReducedHTML(url).then(html => {
    if (html) {
        console.log(html);  // This will print the cleaned HTML content with 'id' and 'class' retained
    }
});
