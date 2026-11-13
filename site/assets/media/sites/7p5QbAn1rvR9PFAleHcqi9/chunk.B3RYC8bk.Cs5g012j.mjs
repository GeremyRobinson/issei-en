import{t as e}from"./rolldown-runtime.Bi-D_2cA.mjs";import{At as t,Mt as n,Nt as r,jt as i,kt as a}from"./studio.COxl42YJ.mjs";function o(e){let t=!1,n;return{get value(){return t||=(n=e(),!0),n}}}function s(){return a.current()===a.preview?_.value:g.value}function c(e,t){let n=a.current()===a.preview?_.value:g.value;for(let r of n)i(r,e,t)}var l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{t(),l=`--studio-will-change-override`,u=`--studio-will-change-effect-override`,d=`--studio-will-change-filter-override`,f=`--overflow-clip-fallback`,p=`--one-if-corner-shape-supported`,m=[`[data-studio-component-type="DeprecatedRichText"] { cursor: inherit; }`,`
[data-studio-component-type="DeprecatedRichText"] .text-styles-preset-reset {
    --studio-font-family: Inter, Inter Placeholder, sans-serif;
    --studio-font-style: normal;
    --studio-font-weight: 500;
    --studio-text-color: #000;
    --studio-font-size: 16px;
    --studio-letter-spacing: 0;
    --studio-text-transform: none;
    --studio-text-decoration: none;
    --studio-line-height: 1.2em;
    --studio-text-alignment: start;
    --studio-font-open-type-features: normal;
    --font-variation-settings: normal;
}
`,`
[data-studio-component-type="DeprecatedRichText"] p,
[data-studio-component-type="DeprecatedRichText"] div,
[data-studio-component-type="DeprecatedRichText"] h1,
[data-studio-component-type="DeprecatedRichText"] h2,
[data-studio-component-type="DeprecatedRichText"] h3,
[data-studio-component-type="DeprecatedRichText"] h4,
[data-studio-component-type="DeprecatedRichText"] h5,
[data-studio-component-type="DeprecatedRichText"] h6 {
    margin: 0;
    padding: 0;
}
`,`
[data-studio-component-type="DeprecatedRichText"] p,
[data-studio-component-type="DeprecatedRichText"] div,
[data-studio-component-type="DeprecatedRichText"] h1,
[data-studio-component-type="DeprecatedRichText"] h2,
[data-studio-component-type="DeprecatedRichText"] h3,
[data-studio-component-type="DeprecatedRichText"] h4,
[data-studio-component-type="DeprecatedRichText"] h5,
[data-studio-component-type="DeprecatedRichText"] h6,
[data-studio-component-type="DeprecatedRichText"] li,
[data-studio-component-type="DeprecatedRichText"] ol,
[data-studio-component-type="DeprecatedRichText"] ul,
[data-studio-component-type="DeprecatedRichText"] span:not([data-text-fill]) {
    font-family: var(--studio-font-family, Inter, Inter Placeholder, sans-serif);
    font-style: var(--studio-font-style, normal);
    font-weight: var(--studio-font-weight, 400);
    color: var(--studio-text-color, #000);
    font-size: var(--studio-font-size, 16px);
    letter-spacing: var(--studio-letter-spacing, 0);
    text-transform: var(--studio-text-transform, none);
    text-decoration: var(--studio-text-decoration, none);
    line-height: var(--studio-line-height, 1.2em);
    text-align: var(--studio-text-alignment, start);
}
`,`
[data-studio-component-type="DeprecatedRichText"] p:not(:first-child),
[data-studio-component-type="DeprecatedRichText"] div:not(:first-child),
[data-studio-component-type="DeprecatedRichText"] h1:not(:first-child),
[data-studio-component-type="DeprecatedRichText"] h2:not(:first-child),
[data-studio-component-type="DeprecatedRichText"] h3:not(:first-child),
[data-studio-component-type="DeprecatedRichText"] h4:not(:first-child),
[data-studio-component-type="DeprecatedRichText"] h5:not(:first-child),
[data-studio-component-type="DeprecatedRichText"] h6:not(:first-child),
[data-studio-component-type="DeprecatedRichText"] ol:not(:first-child),
[data-studio-component-type="DeprecatedRichText"] ul:not(:first-child),
[data-studio-component-type="DeprecatedRichText"] .studio-image:not(:first-child) {
    margin-top: var(--studio-paragraph-spacing, 0);
}
`,`
[data-studio-component-type="DeprecatedRichText"] span[data-text-fill] {
    display: inline-block;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
`,`
[data-studio-component-type="DeprecatedRichText"] a,
[data-studio-component-type="DeprecatedRichText"] a span:not([data-text-fill]) {
    font-family: var(--studio-link-font-family, var(--studio-font-family, Inter, Inter Placeholder, sans-serif));
    font-style: var(--studio-link-font-style, var(--studio-font-style, normal));
    font-weight: var(--studio-link-font-weight, var(--studio-font-weight, 400));
    color: var(--studio-link-text-color, var(--studio-text-color, #000));
    font-size: var(--studio-link-font-size, var(--studio-font-size, 16px));
    text-transform: var(--studio-link-text-transform, var(--studio-text-transform, none));
    text-decoration: var(--studio-link-text-decoration, var(--studio-text-decoration, none));
}
`,`
[data-studio-component-type="DeprecatedRichText"] a:hover,
[data-studio-component-type="DeprecatedRichText"] a:hover span:not([data-text-fill]) {
    font-family: var(--studio-link-hover-font-family, var(--studio-link-font-family, var(--studio-font-family, Inter, Inter Placeholder, sans-serif)));
    font-style: var(--studio-link-hover-font-style, var(--studio-link-font-style, var(--studio-font-style, normal)));
    font-weight: var(--studio-link-hover-font-weight, var(--studio-link-font-weight, var(--studio-font-weight, 400)));
    color: var(--studio-link-hover-text-color, var(--studio-link-text-color, var(--studio-text-color, #000)));
    font-size: var(--studio-link-hover-font-size, var(--studio-link-font-size, var(--studio-font-size, 16px)));
    text-transform: var(--studio-link-hover-text-transform, var(--studio-link-text-transform, var(--studio-text-transform, none)));
    text-decoration: var(--studio-link-hover-text-decoration, var(--studio-link-text-decoration, var(--studio-text-decoration, none)));
}
`,`
[data-studio-component-type="DeprecatedRichText"] a[data-studio-page-link-current],
[data-studio-component-type="DeprecatedRichText"] a[data-studio-page-link-current] span:not([data-text-fill]):not([data-nested-link]) {
    font-family: var(--studio-link-current-font-family, var(--studio-link-font-family, var(--studio-font-family, Inter, Inter Placeholder, sans-serif)));
    font-style: var(--studio-link-current-font-style, var(--studio-link-font-style, var(--studio-font-style, normal)));
    font-weight: var(--studio-link-current-font-weight, var(--studio-link-font-weight, var(--studio-font-weight, 400)));
    color: var(--studio-link-current-text-color, var(--studio-link-text-color, var(--studio-text-color, #000)));
    font-size: var(--studio-link-current-font-size, var(--studio-link-font-size, var(--studio-font-size, 16px)));
    text-transform: var(--studio-link-current-text-transform, var(--studio-link-text-transform, var(--studio-text-transform, none)));
    text-decoration: var(--studio-link-current-text-decoration, var(--studio-link-text-decoration, var(--studio-text-decoration, none)));
}
`,`
[data-studio-component-type="DeprecatedRichText"] a[data-studio-page-link-current]:hover,
[data-studio-component-type="DeprecatedRichText"] a[data-studio-page-link-current]:hover span:not([data-text-fill]):not([data-nested-link]) {
    font-family: var(--studio-link-hover-font-family, var(--studio-link-current-font-family, var(--studio-link-font-family, var(--studio-font-family, Inter, Inter Placeholder, sans-serif))));
    font-style: var(--studio-link-hover-font-style, var(--studio-link-current-font-style, var(--studio-link-font-style, var(--studio-font-style, normal))));
    font-weight: var(--studio-link-hover-font-weight, var(--studio-link-current-font-weight, var(--studio-link-font-weight, var(--studio-font-weight, 400))));
    color: var(--studio-link-hover-text-color, var(--studio-link-current-text-color, var(--studio-link-text-color, var(--studio-text-color, #000))));
    font-size: var(--studio-link-hover-font-size, var(--studio-link-current-font-size, var(--studio-link-font-size, var(--studio-font-size, 16px))));
    text-transform: var(--studio-link-hover-text-transform, var(--studio-link-current-text-transform, var(--studio-link-text-transform, var(--studio-text-transform, none))));
    text-decoration: var(--studio-link-hover-text-decoration, var(--studio-link-current-text-decoration, var(--studio-link-text-decoration, var(--studio-text-decoration, none))));
}
`,`
[data-studio-component-type="DeprecatedRichText"] strong {
    font-weight: bolder;
}
`,`
[data-studio-component-type="DeprecatedRichText"] em {
    font-style: italic;
}
`,`
[data-studio-component-type="DeprecatedRichText"] .studio-image {
    display: block;
    max-width: 100%;
    height: auto;
}
`,`
[data-studio-component-type="DeprecatedRichText"] ul,
[data-studio-component-type="DeprecatedRichText"] ol {
    display: table;
    width: 100%;
    padding-left: 0;
    margin: 0;
}
`,`
[data-studio-component-type="DeprecatedRichText"] li {
    display: table-row;
    counter-increment: list-item;
    list-style: none;
}
`,`
[data-studio-component-type="DeprecatedRichText"] ol > li::before {
    display: table-cell;
    width: 2.25ch;
    box-sizing: border-box;
    padding-right: 0.75ch;
    content: counter(list-item) ".";
    white-space: nowrap;
}
`,`
[data-studio-component-type="DeprecatedRichText"] ul > li::before {
    display: table-cell;
    width: 2.25ch;
    box-sizing: border-box;
    padding-right: 0.75ch;
    content: "•";
}
`],h=e=>{let t=[`[data-studio-component-type="Text"] { cursor: inherit; }`,`[data-studio-component-text-autosized] * { white-space: pre; }`,`
[data-studio-component-type="Text"] > * {
    text-align: var(--studio-text-alignment, start);
}`,`
[data-studio-component-type="Text"] span span,
[data-studio-component-type="Text"] p span,
[data-studio-component-type="Text"] h1 span,
[data-studio-component-type="Text"] h2 span,
[data-studio-component-type="Text"] h3 span,
[data-studio-component-type="Text"] h4 span,
[data-studio-component-type="Text"] h5 span,
[data-studio-component-type="Text"] h6 span {
    display: block;
}`,`
[data-studio-component-type="Text"] span span span,
[data-studio-component-type="Text"] p span span,
[data-studio-component-type="Text"] h1 span span,
[data-studio-component-type="Text"] h2 span span,
[data-studio-component-type="Text"] h3 span span,
[data-studio-component-type="Text"] h4 span span,
[data-studio-component-type="Text"] h5 span span,
[data-studio-component-type="Text"] h6 span span {
    display: unset;
}`,`
[data-studio-component-type="Text"] div div span,
[data-studio-component-type="Text"] a div span,
[data-studio-component-type="Text"] span span span,
[data-studio-component-type="Text"] p span span,
[data-studio-component-type="Text"] h1 span span,
[data-studio-component-type="Text"] h2 span span,
[data-studio-component-type="Text"] h3 span span,
[data-studio-component-type="Text"] h4 span span,
[data-studio-component-type="Text"] h5 span span,
[data-studio-component-type="Text"] h6 span span,
[data-studio-component-type="Text"] a {
    font-family: var(--font-family);
    font-style: var(--font-style);
    font-weight: min(calc(var(--studio-font-weight-increase, 0) + var(--font-weight, 400)), 900);
    color: var(--text-color);
    letter-spacing: var(--letter-spacing);
    font-size: var(--font-size);
    text-transform: var(--text-transform);
    --text-decoration: var(--studio-text-decoration-style, solid) var(--studio-text-decoration, none) var(--studio-text-decoration-color, currentcolor) var(--studio-text-decoration-thickness, auto);
    --text-decoration-skip-ink: var(--studio-text-decoration-skip-ink);
    --text-underline-offset: var(--studio-text-decoration-offset);
    line-height: var(--line-height);
}`,`
[data-studio-component-type="Text"] div div span,
[data-studio-component-type="Text"] a div span,
[data-studio-component-type="Text"] span span span,
[data-studio-component-type="Text"] p span span,
[data-studio-component-type="Text"] h1 span span,
[data-studio-component-type="Text"] h2 span span,
[data-studio-component-type="Text"] h3 span span,
[data-studio-component-type="Text"] h4 span span,
[data-studio-component-type="Text"] h5 span span,
[data-studio-component-type="Text"] h6 span span,
[data-studio-component-type="Text"] a {
    --font-family: var(--studio-font-family);
    --font-style: var(--studio-font-style);
    --font-weight: var(--studio-font-weight);
    --text-color: var(--studio-text-color);
    --letter-spacing: var(--studio-letter-spacing);
    --font-size: var(--studio-font-size);
    --text-transform: var(--studio-text-transform);
    --text-decoration: var(--studio-text-decoration-style, solid) var(--studio-text-decoration, none) var(--studio-text-decoration-color, currentcolor) var(--studio-text-decoration-thickness, auto);
    --text-decoration-skip-ink: var(--studio-text-decoration-skip-ink);
    --text-underline-offset: var(--studio-text-decoration-offset);
    --line-height: var(--studio-line-height);
}`,`
[data-studio-component-type="Text"] a,
[data-studio-component-type="Text"] a div span,
[data-studio-component-type="Text"] a span span span,
[data-studio-component-type="Text"] a p span span,
[data-studio-component-type="Text"] a h1 span span,
[data-studio-component-type="Text"] a h2 span span,
[data-studio-component-type="Text"] a h3 span span,
[data-studio-component-type="Text"] a h4 span span,
[data-studio-component-type="Text"] a h5 span span,
[data-studio-component-type="Text"] a h6 span span {
    --font-family: var(--studio-link-font-family, var(--studio-font-family));
    --font-style: var(--studio-link-font-style, var(--studio-font-style));
    --font-weight: var(--studio-link-font-weight, var(--studio-font-weight));
    --text-color: var(--studio-link-text-color, var(--studio-text-color));
    --font-size: var(--studio-link-font-size, var(--studio-font-size));
    --text-transform: var(--studio-link-text-transform, var(--studio-text-transform));
    --text-decoration: var(--studio-link-text-decoration-style, var(--studio-text-decoration-style, solid)) var(--studio-link-text-decoration, var(--studio-text-decoration, none)) var(--studio-link-text-decoration-color, var(--studio-text-decoration-color, currentcolor)) var(--studio-link-text-decoration-thickness, var(--studio-text-decoration-thickness, auto));
    --text-decoration-skip-ink: var(--studio-link-text-decoration-skip-ink, var(--studio-text-decoration-skip-ink));
    --text-underline-offset: var(--studio-link-text-decoration-offset, var(--studio-text-decoration-offset));
}`,`
[data-studio-component-type="Text"] a:hover,
[data-studio-component-type="Text"] a div span:hover,
[data-studio-component-type="Text"] a span span span:hover,
[data-studio-component-type="Text"] a p span span:hover,
[data-studio-component-type="Text"] a h1 span span:hover,
[data-studio-component-type="Text"] a h2 span span:hover,
[data-studio-component-type="Text"] a h3 span span:hover,
[data-studio-component-type="Text"] a h4 span span:hover,
[data-studio-component-type="Text"] a h5 span span:hover,
[data-studio-component-type="Text"] a h6 span span:hover {
    --font-family: var(--studio-link-hover-font-family, var(--studio-link-font-family, var(--studio-font-family)));
    --font-style: var(--studio-link-hover-font-style, var(--studio-link-font-style, var(--studio-font-style)));
    --font-weight: var(--studio-link-hover-font-weight, var(--studio-link-font-weight, var(--studio-font-weight)));
    --text-color: var(--studio-link-hover-text-color, var(--studio-link-text-color, var(--studio-text-color)));
    --font-size: var(--studio-link-hover-font-size, var(--studio-link-font-size, var(--studio-font-size)));
    --text-transform: var(--studio-link-hover-text-transform, var(--studio-link-text-transform, var(--studio-text-transform)));
    --text-decoration: var(--studio-link-hover-text-decoration-style, var(--studio-link-text-decoration-style, var(--studio-text-decoration-style, solid))) var(--studio-link-hover-text-decoration, var(--studio-link-text-decoration, var(--studio-text-decoration, none))) var(--studio-link-hover-text-decoration-color, var(--studio-link-text-decoration-color, var(--studio-text-decoration-color, currentcolor))) var(--studio-link-hover-text-decoration-thickness, var(--studio-link-text-decoration-thickness, var(--studio-text-decoration-thickness, auto)));
    --text-decoration-skip-ink: var(--studio-link-hover-text-decoration-skip-ink, var(--studio-link-text-decoration-skip-ink, var(--studio-text-decoration-skip-ink)));
    --text-underline-offset: var(--studio-link-hover-text-decoration-offset, var(--studio-link-text-decoration-offset, var(--studio-text-decoration-offset)));
}`,`
[data-studio-component-type="Text"].isCurrent a,
[data-studio-component-type="Text"].isCurrent a div span,
[data-studio-component-type="Text"].isCurrent a span span span,
[data-studio-component-type="Text"].isCurrent a p span span,
[data-studio-component-type="Text"].isCurrent a h1 span span,
[data-studio-component-type="Text"].isCurrent a h2 span span,
[data-studio-component-type="Text"].isCurrent a h3 span span,
[data-studio-component-type="Text"].isCurrent a h4 span span,
[data-studio-component-type="Text"].isCurrent a h5 span span,
[data-studio-component-type="Text"].isCurrent a h6 span span {
    --font-family: var(--studio-link-current-font-family, var(--studio-link-font-family, var(--studio-font-family)));
    --font-style: var(--studio-link-current-font-style, var(--studio-link-font-style, var(--studio-font-style)));
    --font-weight: var(--studio-link-current-font-weight, var(--studio-link-font-weight, var(--studio-font-weight)));
    --text-color: var(--studio-link-current-text-color, var(--studio-link-text-color, var(--studio-text-color)));
    --font-size: var(--studio-link-current-font-size, var(--studio-link-font-size, var(--studio-font-size)));
    --text-transform: var(--studio-link-current-text-transform, var(--studio-link-text-transform, var(--studio-text-transform)));
    --text-decoration: var(--studio-link-current-text-decoration-style, var(--studio-link-text-decoration-style, var(--studio-text-decoration-style, solid))) var(--studio-link-current-text-decoration, var(--studio-link-text-decoration, var(--studio-text-decoration, none))) var(--studio-link-current-text-decoration-color, var(--studio-link-text-decoration-color, var(--studio-text-decoration-color, currentcolor))) var(--studio-link-current-text-decoration-thickness, var(--studio-link-text-decoration-thickness, var(--studio-text-decoration-thickness, auto)));
    --text-decoration-skip-ink: var(--studio-link-current-text-decoration-skip-ink, var(--studio-link-text-decoration-skip-ink, var(--studio-text-decoration-skip-ink)));
    --text-underline-offset: var(--studio-link-current-text-decoration-offset, var(--studio-link-text-decoration-offset, var(--studio-text-decoration-offset)));
}`],i=[`[data-studio-component-type="Scroll"]::-webkit-scrollbar { display: none; }`,`[data-studio-component-type="ScrollContentWrapper"] > * { position: relative; }`],a=[`[data-studio-component-type="NativeScroll"] { -webkit-overflow-scrolling: touch; }`,`[data-studio-component-type="NativeScroll"] > * { position: relative; }`,`[data-studio-component-type="NativeScroll"].direction-both { overflow-x: auto; overflow-y: auto; }`,`[data-studio-component-type="NativeScroll"].direction-vertical { overflow-x: hidden; overflow-y: auto; }`,`[data-studio-component-type="NativeScroll"].direction-horizontal { overflow-x: auto; overflow-y: hidden; }`,`[data-studio-component-type="NativeScroll"].direction-vertical > * { width: 100% !important; }`,`[data-studio-component-type="NativeScroll"].direction-horizontal > * { height: 100% !important; }`,`[data-studio-component-type="NativeScroll"].scrollbar-hidden::-webkit-scrollbar { display: none; }`],o=[`[data-studio-cursor="pointer"] { cursor: pointer; }`,`[data-studio-cursor="grab"] { cursor: grab; }`,`[data-studio-cursor="grab"]:active { cursor: grabbing; }`],s=[`[data-studio-component-type="Frame"] *, [data-studio-component-type="Stack"] * { pointer-events: auto; }`,`[data-studio-generated] * { pointer-events: unset }`],c=[`[data-hide-scrollbars="true"]::-webkit-scrollbar { width: 0px; height: 0px; }`,`[data-hide-scrollbars="true"]::-webkit-scrollbar-thumb { background: transparent; }`,`[data-hide-scrollbars="true"] { scrollbar-width: none; }`],h=`(background: -webkit-named-image(i))`,g=e=>e?[`body { ${l}: none; }`,`@supports ${h} and (not (grid-template-rows: subgrid)) { body { ${l}: transform; } }`]:[`body { ${l}: none; ${u}: none; }`],_=e=>e?[`body { ${d}: none; }`,`@supports ${h} and (not (position-area: top right)) { body { ${d}: filter; } }`]:[`body { ${d}: none; }`],v=e=>e?s:[],y=`@supports (not (overflow: clip)) {
        :root { ${f}: hidden; }
    }`,b=`@supports (corner-shape: superellipse(2)) { :root { ${p}: 1 } }`;return[...g(e),..._(e),`[data-studio-component-type] { position: absolute; }`,...t,...n,...m,`
[data-studio-component-type="Stack"]:not([data-studio-generated]) > *,
[data-studio-component-type="Stack"]:not([data-studio-generated]) > [data-studio-component-type] {
    position: relative;
}`,`
NavigationContainer
[data-studio-component-type="NavigationContainer"] > *,
[data-studio-component-type="NavigationContainer"] > [data-studio-component-type] {
    position: relative;
}`,...i,...a,`[data-studio-component-type="PageContentWrapper"] > *, [data-studio-component-type="PageContentWrapper"] > [data-studio-component-type] { position: relative; }`,`[data-studio-component-type="DeviceComponent"].no-device > * { width: 100% !important; height: 100% !important; }`,`[data-is-present="false"], [data-is-present="false"] * { pointer-events: none !important; }`,...o,...v(e),`.svgContainer svg { display: block; }`,`[data-reset="button"] {
        border-width: 0;
        padding: 0;
        background: none;
}`,...c,y,`.studio-lightbox-container { opacity: 1 !important; pointer-events: auto !important; }`,...r,b]},g=/* @__PURE__ */ o(()=>h(!1)),_=/* @__PURE__ */ o(()=>h(!0))})))()}v();export{_ as combinedCSSRulesForPreview,s as getCombinedCSSRules,c as injectComponentCSSRulesWithSheet};
//# sourceMappingURL=chunk.B3RYC8bk.Cs5g012j.mjs.map