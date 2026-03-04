// NOTE: Config differs from tutorial (https://www.youtube.com/watch?v=4wD00RT6d-g) - for 11ty v3.

module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./src/style.css')
    eleventyConfig.addPassthroughCopy('./src/assets')

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}