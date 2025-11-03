import { defineComponent } from "vue";
import { defineOgImage } from "../../composables/defineOgImage.js";
export default defineComponent({
  name: "OgImage",
  async setup(_, { attrs }) {
    if (import.meta.server)
      defineOgImage(attrs);
    return () => null;
  }
});
