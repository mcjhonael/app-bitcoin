<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <bounce-loader :loading="isLoading" :color="'#68d391'" :size="100" />
    </div>
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleConverter"
            class="
              bg-green-500
              hover:bg-green-700
              text-white
              font-bold
              py-2
              px-4
              rounded
            "
          >
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                id="convertValue"
                type="number"
                class="
                  text-center
                  bg-white
                  focus:outline-none focus:shadow-outline
                  border border-gray-300
                  rounded-lg
                  py-2
                  px-4
                  block
                  w-full
                  appearance-none
                  leading-normal
                "
                :placeholder="`Valor en ${fromUsd ? asset.symbol : 'USD'}`"
              />
            </label>
          </div>

          <span class="text-xl"
            >{{ convertResult }} {{ fromUsd ? asset.symbol : "USD" }}</span
          >
        </div>
      </div>
      <line-chart
        class="my-10"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      />
      <h3>Mejores Ofertas de Cambio</h3>
      <table>
        <!-- //como clave le pasamos el nombre del Exchange y el valor del Exchange -->
        <tr
          v-for="market in markets"
          :key="`${market.exchangeId}-${market.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ market.exchangeId }}</b>
          </td>
          <td>{{ market.priceUsd }}</td>
          <td>{{ market.baseSymbol }} / {{ market.quoteSymbol }}</td>
          <!-- cada vez que haga un click en el bottom debe hacer una llamado ala api que devolvera toda la info de ese obj seleccionado</td> -->
          <td>
            <!-- si no tiene url  -->
            <px-button
              :is-loading="market.isLoading || false"
              v-if="!market.url"
              @custom-click="getWebSite(market)"
            >
              <slot>Obtener Link</slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blank">
              {{ market.url }}
            </a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import { getAsset, getAssetHistory, getExchange, getMarkets } from "@/api";
import PxButton from "@/components/PxButton";

export default {
  name: "CoinDetail",
  components: { PxButton },
  data() {
    return {
      //aqui es donde vamos aguardar nuestro info obtenida de la api
      isLoading: false,
      asset: {},
      history: [],
      markets: [],
      fromUsd: true,
      convertValue: null,
    };
  },

  computed: {
    convertResult() {
      if (!this.convertValue) {
        return 0;
      }
      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;
      return result.toFixed(4);
    },
    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },

    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },

    avg() {
      return Math.abs(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    // datos(){
    //   return this.history.map(h=>[h.date,parseFloat(h.priceUsd).toFixed(2)])
    // }
  },
  // queremos escuchar cambios dentro del componenet o de la propi $route
  watch: {
    //que cuando cambie $route llamamos a la function getCoin
    $route() {
      this.getCoin();
    },
  },
  created() {
    this.getCoin();
  },
  // tis.$set() es un solucionador cuando tenemos el problema de reactivida este problema solo lo vamos a tener cuando tengamos objetos o array y cuando queramos agregar alguna prop a estos osea que cuando el objeto sus prop no fueron establecidos antes
  methods: {
    // exchange.url=res.exchangeUrl;
    // recibe 1 al objeto que le queremos agregar una nueva propiedad 2 el nombre de la prop 3 el valor que queremos asignarle
    toggleConverter() {
      this.fromUsd = !this.fromUsd;
    },
    getWebSite(exchange) {
      this.$set(exchange, "isLoading", true);

      getExchange(exchange.exchangeId)
        .then((res) => this.$set(exchange, "url", res.exchangeUrl))
        .finally(() => {
          this.$set(exchange, "isLoading", false);
        });
    },
    getCoin() {
      //obtiene toda la inf de la ruta con el $route de alli van deslosando hasta obtener el id del elemento seleccionado por este componente
      const id = this.$route.params.id;
      this.isLoading = true;

      getAsset(id)
        .then((asset) => (this.asset = asset))
        .finally(() => {
          this.isLoading = false;
        });

      getAssetHistory(id)
        .then((history) => (this.history = history))
        .finally(() => {
          this.isLoading = false;
        });

      getMarkets(id).then((markets) => (this.markets = markets));
    },
  },
};
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
