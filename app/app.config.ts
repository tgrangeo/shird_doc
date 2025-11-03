export default defineAppConfig({
    ui: {
        colors: {
            primary: 'teal',
            neutral: 'slate'
        },
        pageCard: {
            slots: {
                container: 'lg:flex min-w-0',
                wrapper: 'flex-none',
            },
        },
    }
})