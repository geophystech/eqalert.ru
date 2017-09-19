<template>
  <div id="map">
  	THIS IS <del>SPARTA</del> MAP!
    <vue-markdown>
  	  I am a ~~tast~~ **test**.
    </vue-markdown>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'map',
  components: { VueMarkdown }
}
</script>

