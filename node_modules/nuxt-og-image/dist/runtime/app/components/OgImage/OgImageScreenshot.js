import { defineComponent } from "vue";
import { defineOgImageScreenshot } from "../../composables/defineOgImageScreenshot.js";
export default defineComponent({
  name: "OgImageScreenshot",
  async setup(_, { attrs }) {
    if (import.meta.server)
      defineOgImageScreenshot(attrs);
    return () => null;
  }
});
