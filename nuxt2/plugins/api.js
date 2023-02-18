import Config from "@/settings/api";

export default ({ $config }, inject) => {
  const apiConfig = new Config($config)
  inject('api', apiConfig)
}
