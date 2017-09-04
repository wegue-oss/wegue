<template>
  <v-navigation-drawer
       class="pb-0 vt-webgis-infowindow"
       permanent
       absolute
       height="100%"
       light
       right
     >
     <v-card
        class="info-card">
         <v-card-media src="http://via.placeholder.com/200x200" height="200px">
         </v-card-media>
         <v-card-title primary-title>
           <div>
             <h3 class="headline mb-0">{{title}}</h3>
             <div>{{description1}} <br> {{description2}}</div>
           </div>
         </v-card-title>
         <v-card-actions>
           <v-btn flat class="orange--text">Share</v-btn>
           <v-btn flat class="orange--text">Explore</v-btn>
         </v-card-actions>
    </v-card>

  </v-navigation-drawer>
</template>

<script>

export default {
  name: 'info-window',
  data () {
    return {
      title: 'Zentrum Alte Schule',
      description1: 'Gemeindezentrum Zur Alten Schule',
      description2: 'Foo bar test ...'
    }
  },
  mounted () {
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .vt-webgis-infowindow {
    padding: 75px 5px 5px 5px
  }

  .vt-webgis-infowindow .info-card {
    background-color: white;
    padding: 5px;
    height: 100%;
  }

</style>
