<template>
  <div>
    <bounce-loader :loading="isLoading" :color="'#68d391'" :size="100" />
    <px-assets-table v-if="!isLoading" :assets="assets" />
  </div>
</template>

<script>
import { getAssets } from "@/api";
import PxAssetsTable from "@/components/PxAssetsTable";
export default {
  name: "Home",
  components: { PxAssetsTable },
  data() {
    return {
      isLoading: false,
      assets: [],
    };
  },
  created() {
    // la ventaja de usar el finally es q cuando haya o no un error igual se va apagar el isLoading
    this.isLoading = true;
    getAssets()
      .then((assets) => (this.assets = assets))
      .finally(() => {
        this.isLoading = false;
      });
  },
  // created() {
  //   api.getAssets().then(assets=>(this.assets=assets))
  // }
};
</script>
