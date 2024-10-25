import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function fetchPlainText(url, timeout = 5000) {
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

        // Remove unwanted elements
        $('script, style, iframe, noscript').remove();

        // Recursive function to extract text
        function getTextRecursive(element) {
            let text = '';
            element.contents().each(function() {
                if (this.type === 'text') {
                    text += $(this).text() + ' ';
                } else if (this.type === 'tag') {
                    text += getTextRecursive($(this));
                }
            });
            return text;
        }

        // Start from the body element
        const body = $('body');
        const plainText = getTextRecursive(body);

        // Clean up the text
        const cleanedText = plainText.replace(/\s\s+/g, ' ').trim();

        return cleanedText;
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
fetchPlainText(url).then(text => {
    if (text) {
        console.log(text);  // This will print only the cleaned plain text content
    }
});
