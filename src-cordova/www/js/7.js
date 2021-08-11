(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{"39a1":function(o,t,i){"use strict";var s=i("5da2"),e=i.n(s);e.a},"5da2":function(o,t,i){},"8e64":function(o,t,i){"use strict";i.r(t);var s=function(){var o=this,t=o.$createElement,i=o._self._c||t;return i("q-page",[i("div",{staticStyle:{display:"grid"}},[i("div",{staticClass:"row justify-center contenedor-opciones"},[i("div",{staticClass:"col-12",staticStyle:{display:"flex","justify-content":"center"}},[i("q-checkbox",{model:{value:o.sinFechaEsperada,callback:function(t){o.sinFechaEsperada=t},expression:"sinFechaEsperada"}},[o._v("\n          Mostrar sin fecha esperada y realizados\n        ")])],1),i("div",{staticClass:"col-4",staticStyle:{display:"flex","justify-content":"center"}},[i("q-select",{staticClass:"bg-white text-black select-clase",attrs:{label:"Tipo de Movimiento",multiple:"",options:o.opcionesTiposMov},model:{value:o.TipoMov,callback:function(t){o.TipoMov=t},expression:"TipoMov"}})],1),i("div",{staticClass:"col-4",staticStyle:{display:"flex","justify-content":"center"}},[i("q-select",{staticClass:"bg-white text-black select-clase",attrs:{"stack-label":"",label:"Estado de Ambito de Gestión",multiple:"",options:o.opcionesEstadoAmbito},model:{value:o.EstadoAmbito,callback:function(t){o.EstadoAmbito=t},expression:"EstadoAmbito"}})],1),i("div",{staticClass:"col-4",staticStyle:{display:"flex","justify-content":"center"}},[i("q-select",{staticClass:"bg-white text-black select-clase",attrs:{label:"Usuario",multiple:"",options:o.opcionesUsuarios},on:{input:function(t){return o.filtrarPorUsuario()}},model:{value:o.Usuario,callback:function(t){o.Usuario=t},expression:"Usuario"}})],1),i("q-input",{staticClass:"input-clase",attrs:{"bg-color":"white",square:"",filled:"",outlined:"",debounce:600,placeholder:"Buscar por detalle del movimiento"},model:{value:o.busqueda,callback:function(t){o.busqueda=t},expression:"busqueda"}}),i("div",{staticStyle:{"margin-top":"20px"}},[i("q-radio",{attrs:{val:"",label:"Todos"},model:{value:o.ver,callback:function(t){o.ver=t},expression:"ver"}}),i("q-radio",{attrs:{val:"negative",label:"Perentorios"},model:{value:o.ver,callback:function(t){o.ver=t},expression:"ver"}}),i("q-radio",{attrs:{val:"primary",label:"Gestion Estudio"},model:{value:o.ver,callback:function(t){o.ver=t},expression:"ver"}}),i("q-radio",{attrs:{val:"warning",label:"Gestion Externa"},model:{value:o.ver,callback:function(t){o.ver=t},expression:"ver"}}),i("q-radio",{attrs:{val:"positive",label:"Finalizados"},model:{value:o.ver,callback:function(t){o.ver=t},expression:"ver"}})],1)],1),0===o.movimientos.length?i("div",[i("Loading")],1):o._e(),i("q-infinite-scroll",{staticClass:"movimientos__container",staticStyle:{width:"100%",padding:"0px",margin:"0px"},attrs:{disable:o.noHayMasMovimientos,offset:2e3},on:{load:o.onLoad},scopedSlots:o._u([{key:"loading",fn:function(){return[i("div",{staticClass:"row justify-center q-my-md"},[i("q-spinner-dots",{staticStyle:{position:"fixed",bottom:"10px",left:"50%"},attrs:{color:"primary",size:"100px"}})],1)]},proxy:!0}])},o._l(o.filtrarPorTipo,(function(t,s){return i("TarjetaMovimiento",{key:s,staticClass:"tarjeta-mov",attrs:{movimiento:t},on:{borrar:function(t){return o.eliminarMovimiento(t)}}})})),1)],1)])},e=[],a=(i("7514"),i("6762"),i("2fdb"),i("3786")),n=function(){var o=this,t=o.$createElement,i=o._self._c||t;return i("div",{staticClass:"shadow-1",staticStyle:{background:"white",padding:"1em"}},[i("q-search",{attrs:{debounce:600,placeholder:o.placeholder||"Buscar"},on:{input:o.ingresoBusqueda},model:{value:o.textoBusqueda,callback:function(t){o.textoBusqueda=t},expression:"textoBusqueda"}}),o.displayOptions?i("q-expansion-item",{attrs:{opened:!0,popup:!0,"icon-toggle":!0,label:"Seleccionar tipo de busqueda"}},o._l(o.tiposBusqueda,(function(t){return i("div",{key:t.TipoBusqueda,staticClass:"tipo-busqueda",on:{click:function(i){return o.seleccionTipo(t)}}},[i("q-icon",{staticClass:"on-left",attrs:{name:t.icon}}),o._v(" "+o._s(t.TipoBusqueda)+"\n    ")],1)})),0):o._e(),o._l(o.Selecciones,(function(t,s){return i("q-chip",{key:s,staticStyle:{margin:".4em .2em .2em 0"},attrs:{icon:t.icon,color:"primary",closable:"",small:""},on:{hide:function(t){return o.quitarSeleccion(s)}}},[o._v("\n    "+o._s(t.Texto)+"\n  ")])}))],2)},r=[],c=(i("f751"),{props:["placeholder"],data:function(){return{displayOptions:!1,Selecciones:[],textoBusqueda:"",tiposBusqueda:[{TipoBusqueda:"Persona",icon:"face"},{TipoBusqueda:"Juzgado",icon:"account_balance"}]}},methods:{ingresoBusqueda:function(){this.displayOptions=!0},seleccionTipo:function(o){var t=Object.assign({},o);t.Texto=this.textoBusqueda,this.textoBusqueda="",this.displayOptions=!1,this.Selecciones.push(t)},quitarSeleccion:function(o){this.Selecciones.splice(o,1)}}}),l=c,u=(i("39a1"),i("2877")),d=Object(u["a"])(l,n,r,!1,null,null,null),p=d.exports,v=i("8a42"),h=i("3a5e"),f=i("8daa"),m=i("b628"),b={components:{Busqueda:p,TarjetaMovimiento:v["a"],Loading:h["a"],QRadio:a["a"]},name:"Movimientos",data:function(){return{movimientos:[],objetivos:{},noHayMasMovimientos:!1,TipoMov:["Todos"],TiposMov:[],EstadoAmbito:["Todos"],EstadosAmbito:[],Usuario:["Todos"],Usuarios:[],sinFechaEsperada:!1,busqueda:"",ver:""}},created:function(){var o=this,t=m["a"].UsuarioLogueado;this.onLoad(0,(function(){})),f["a"].Get("/estudios/".concat(t.IdEstudio,"/tipos-movimiento"),{},(function(t){t.Error?o.$q.notify(t.Error):t.length?o.TiposMov=t:o.$q.notify("No hay tipos de movimiento disponibles para este estudio")})),f["a"].Get("/estudios/".concat(t.IdEstudio,"/usuarios"),{},(function(t){t.Error?o.$q.notify(t.Error):t.length&&(o.Usuarios=t)})),f["a"].Get("/estado-ambito-gestion",{},(function(t){t.Error?o.$q.notify(t.Error):o.EstadosAmbito=t}))},watch:{busqueda:function(){this.movimientos=[],this.onLoad(0,(function(){}))},ver:function(){this.movimientos=[],this.onLoad(0,(function(){}))}},computed:{opcionesTiposMov:function(){var o=[];return this.TiposMov&&this.TiposMov.length&&(o.push("Todos"),this.TiposMov.forEach((function(t){o.push(t.TipoMovimiento)}))),o},opcionesUsuarios:function(){var o=[];return this.Usuarios&&this.Usuarios.length&&(o.push("Todos"),this.Usuarios.forEach((function(t){o.push(t.Apellidos+", "+t.Nombres)}))),o},opcionesEstadoAmbito:function(){var o=[];return this.EstadosAmbito&&this.EstadosAmbito.length&&(o.push("Todos"),this.EstadosAmbito.forEach((function(t){o.push({label:t.EstadoAmbitoGestion,value:t.IdEstadoAmbitoGestion})}))),o},filtrarPorTipo:function(){var o=this,t=this.sinFechaEsperada?this.movimientos:this.movimientos.filter((function(o){return o.FechaEsperada&&!o.FechaRealizado}));if(0!==this.TipoMov.length&&"Todos"!==this.TipoMov[this.TipoMov.length-1]||(this.TipoMov=["Todos"]),this.TipoMov.length>1&&this.TipoMov.includes("Todos")){var i=this.TipoMov.indexOf("Todos");this.TipoMov.splice(i,1)}if(this.TipoMov.includes("Todos")||(t=t.filter((function(t){return o.TipoMov.includes(t.TipoMovimiento)}))),0!==this.EstadoAmbito.length&&"Todos"!==this.EstadoAmbito[this.EstadoAmbito.length-1]||(this.EstadoAmbito=["Todos"]),this.EstadoAmbito.length>1&&this.EstadoAmbito.includes("Todos")){var s=this.EstadoAmbito.indexOf("Todos");this.EstadoAmbito.splice(s,1)}return this.EstadoAmbito.includes("Todos")||(t=t.filter((function(t){var i=t.IdEstadoAmbitoGestion;if(o.EstadoAmbito.find((function(o){return o.value===i})))return!0}))),t}},methods:{eliminarMovimiento:function(o){this.movimientos.splice(this.movimientos.indexOf(o),1)},onLoad:function(o,t){var i=this,s=JSON.stringify(this.Usuario.filter((function(o){return"Todos"!==o})));f["a"].Get("/casos/0/movimientos?Offset=".concat(this.movimientos.length,"&Cadena=").concat(this.busqueda,"&Color=").concat(this.ver,"&Usuarios=").concat(s),{},(function(o){if(o.Error)i.$q.notify(o.Error);else{if(0===o.length)return i.noHayMasMovimientos=!0,void t();var s=[];if(o.forEach((function(o){i.movimientos.push(o),-1!==s.indexOf(o.IdCaso)||i.objetivos[o.IdCaso]?i.objetivos[o.IdCaso]&&(o.ObjetivosCaso=i.objetivos[o.IdCaso]):s.push(o.IdCaso)})),!s.length)return void t();f["a"].Get("/objetivos?IdsCaso=[".concat(s,"]"),{},(function(o){o.Error||i.movimientos.map((function(t){t.ObjetivosCaso=o[t.IdCaso],i.objetivos[t.IdCaso]||(i.objetivos[t.IdCaso]=[]),i.objetivos[t.IdCaso]=i.objetivos[t.IdCaso].concat(o[t.IdCaso])})),t()}))}}))},filtrarPorUsuario:function(){if(0!==this.Usuario.length&&"Todos"!==this.Usuario[this.Usuario.length-1]||(this.Usuario=["Todos"]),this.Usuario.length>1&&this.Usuario.includes("Todos")){var o=this.Usuario.indexOf("Todos");this.Usuario.splice(o,1)}this.reOnLoad()},reOnLoad:function(){this.movimientos=[],this.onLoad(0,(function(){}))}}},T=b,E=(i("f9d9"),Object(u["a"])(T,s,e,!1,null,null,null));t["default"]=E.exports},e8dd:function(o,t,i){},f9d9:function(o,t,i){"use strict";var s=i("e8dd"),e=i.n(s);e.a}}]);