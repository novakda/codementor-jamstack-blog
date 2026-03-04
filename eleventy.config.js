// NOTE: Config differs from tutorial (https://www.youtube.com/watch?v=4wD00RT6d-g) - for 11ty v3.

const {DateTime} = require('luxon')

module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./src/style.css')
    eleventyConfig.addPassthroughCopy('./src/assets')

    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
    })

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}