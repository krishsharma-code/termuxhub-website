/**
 * TERMUX HUB - WEEKLY UPDATES DATA
 * --------------------------------
 * Simply add a new object to the top of the array to post an update.
 */
const HUB_UPDATES = [
    {
        title: "Python Academy Launched!",
        description: "We've just added a comprehensive Python learning guide for Termux users. Start coding on mobile today!",
        date: "May 24, 2026",
        tag: "NEW GUIDE",
        link: "python.html"
    },
    {
        title: "Sherlock Tool Update",
        description: "The Sherlock OSINT tool guide has been updated with 50+ new social media site definitions.",
        date: "May 20, 2026",
        tag: "UPDATE",
        link: "sherlock.html"
    },
    {
        title: "Dark Mode is Live",
        description: "By popular demand, Termux Hub now supports a sleek Dark Mode. Toggle it in the header!",
        date: "May 15, 2026",
        tag: "FEATURE",
        link: "#"
    }
];

// Export for use in index.html
if (typeof module !== 'undefined') {
    module.exports = HUB_UPDATES;
}
