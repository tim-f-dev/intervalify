const scrollStyles = `
    html, body, #root { height: 100%; overflow: hidden; overscroll-behavior: none; }
    #privacy-scroll, #legal-scroll { overflow-y: scroll !important; overflow-x: hidden !important; scrollbar-width: auto; scrollbar-color: auto; }
    #packs-scroll { overflow-x: scroll !important; overflow-y: hidden !important; scrollbar-width: auto; scrollbar-color: auto; }
    #privacy-scroll::-webkit-scrollbar, #legal-scroll::-webkit-scrollbar { display: block; width: 10px; }
    #packs-scroll::-webkit-scrollbar { display: block; height: 10px; }
    #privacy-scroll::-webkit-scrollbar-track, #legal-scroll::-webkit-scrollbar-track, #packs-scroll::-webkit-scrollbar-track { background: #E5EEE3; border-radius: 8px; }
    #privacy-scroll::-webkit-scrollbar-thumb, #legal-scroll::-webkit-scrollbar-thumb, #packs-scroll::-webkit-scrollbar-thumb { background: #526D67; border-radius: 8px; }
`;
export default function ScrollStyles() { return <style>{scrollStyles}</style>; }
