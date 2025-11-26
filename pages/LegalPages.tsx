import React from 'react';
import { Analytics } from "@vercel/analytics/react"

const PrivacyContent = `
<h2>Privacy Policy</h2>
<p>Last updated: October 2023</p>
<p>At LuminaTools, accessible from lumina-tools.vercel.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by LuminaTools and how we use it.</p>
<h3>Log Files</h3>
<p>LuminaTools follows a standard procedure of using log files. These files log visitors when they visit websites.</p>
<h3>Cookies and Web Beacons</h3>
<p>Like any other website, LuminaTools uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited.</p>
`;

const TermsContent = `
<h2>Terms of Service</h2>
<p>By accessing this website we assume you accept these terms and conditions. Do not continue to use LuminaTools if you do not agree to take all of the terms and conditions stated on this page.</p>
<h3>License</h3>
<p>Unless otherwise stated, LuminaTools and/or its licensors own the intellectual property rights for all material on LuminaTools. All intellectual property rights are reserved.</p>
`;

export const LegalPage: React.FC<{ type: 'privacy' | 'terms' | 'disclaimer' }> = ({ type }) => {
    let content = "";
    if (type === 'privacy') content = PrivacyContent;
    if (type === 'terms') content = TermsContent;
    if (type === 'disclaimer') content = "<h2>Disclaimer</h2><p>All the information on this website - LuminaTools - is published in good faith and for general information purpose only.</p>";

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    )
}
