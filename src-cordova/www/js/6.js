(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{3310:function(o,t,i){},"456e":function(o,t,i){"use strict";var e=i("3310"),a=i.n(e);a.a},6779:function(o,t,i){"use strict";i.r(t);var e,a,s=function(){var o=this,t=o.$createElement,i=o._self._c||t;return i("div",{attrs:{id:"page_container_vencimientos"}},[i("div",{staticClass:"shadow-2",staticStyle:{"margin-bottom":"2em","border-radius":"10px",background:"white"}},[i("p",{staticClass:"titulo bg-primary"},[o._v("Casos")]),o.cargandoCasos?i("div",{staticStyle:{margin:"auto"}},[i("Loading")],1):i("div",{staticStyle:{padding:"0 1rem 1rem 1rem"}},[o._v("\n      Tu estudio tiene "+o._s(o.Casos.length)+" "+o._s(1===o.Casos.length?"caso cargado":"casos cargados")+".\n      Toca\n      "),i("a",{staticClass:"text-primary",staticStyle:{cursor:"pointer","font-weight":"700"},on:{click:function(t){return o.verCasos()}}},[o._v("aquí")]),o._v("\n      para "+o._s(1===o.Casos.length?"verlo":"verlos")+".\n    ")])]),i("div",{staticClass:"row",staticStyle:{display:"flex","justify-content":"space-between"}},[i("div",{staticClass:"col-12 shadow-2",staticStyle:{"margin-bottom":"2em","border-radius":"10px",background:"white"}},[i("p",{staticClass:"titulo bg-primary"},[o._v("Últimos Movimientos:")]),i("div",{staticStyle:{"text-align":"center","margin-bottom":"2rem","padding-top":"1rem"}},[o._v("\n        Ver Perentorios\n        "),i("q-toggle",{staticStyle:{"margin-right":"1rem","margin-left":"1rem"},attrs:{color:"primary"},on:{click:function(t){o.TipoMov=["Todos"],o.EstadoAmbito=["Todos"]}},model:{value:o.filtrar,callback:function(t){o.filtrar=t},expression:"filtrar"}}),o._v("Ver Gestión Estudio/Externa\n      ")],1),o.filtrar?o._e():i("div",{staticClass:"contenidoTarjeta"},[i("q-select",{attrs:{"stack-label":"",label:"Tipo de movimiento",multiple:"",options:o.opcionesTiposMov},model:{value:o.TipoMov,callback:function(t){o.TipoMov=t},expression:"TipoMov"}}),i("q-select",{attrs:{"stack-label":"",label:"Estado de Ambito de Gestión",multiple:"",options:o.opcionesEstadoAmbito},model:{value:o.EstadoAmbito,callback:function(t){o.EstadoAmbito=t},expression:"EstadoAmbito"}}),i("q-select",{attrs:{"stack-label":"",label:"Usuarios",multiple:"",options:o.opcionesUsuarios},model:{value:o.Usuario,callback:function(t){o.Usuario=t},expression:"Usuario"}}),i("br"),0===o.Perentorios.length?i("div",[o.cargandoMovimientos?i("div",[i("Loading")],1):i("div",{staticStyle:{"text-align":"center","font-style":"italic","margin-top":"3rem"}},[o._v("No posee movimientos perentorios")])]):i("div",o._l(o.filtrarPerentorios,(function(t){return i("TarjetaTribunales",{key:t.IdMovimientoCaso,attrs:{movimiento:t,inicio:!0},on:{mostrarObjetivos:function(i){return o.mostrarObjetivos(t)},realizarMovimiento:function(i){return o.realizarMovimiento(t,null)}}})})),1)],1),o.filtrar?i("div",{staticClass:"contenidoTarjeta"},[i("q-select",{attrs:{multiple:"",options:o.opcionesTiposMov},model:{value:o.TipoMov,callback:function(t){o.TipoMov=t},expression:"TipoMov"}}),i("q-select",{attrs:{"stack-label":"",label:"Estado de Ambito de Gestión",multiple:"",options:o.opcionesEstadoAmbito},model:{value:o.EstadoAmbito,callback:function(t){o.EstadoAmbito=t},expression:"EstadoAmbito"}}),i("q-select",{attrs:{"stack-label":"",label:"Usuarios",multiple:"",options:o.opcionesUsuarios},model:{value:o.Usuario,callback:function(t){o.Usuario=t},expression:"Usuario"}}),i("br"),0===o.GestionEstudio.length?i("div",[o.cargandoMovimientos?i("div",[i("Loading")],1):i("div",[o._v("No posee movimientos a gestionar por estudio")])]):i("div",o._l(o.filtrarMovGestion,(function(t){return i("TarjetaTribunales",{key:t.IdMovimientoCaso,attrs:{movimiento:t,inicio:!0},on:{mostrarObjetivos:function(i){return o.mostrarObjetivos(t)},realizarMovimiento:function(i){return o.realizarMovimiento(t,o.juzgado)}}})})),1)],1):o._e()]),o.modalAlta?i("q-dialog",{attrs:{"no-backdrop-dismiss":"","no-esc-dismiss":""},model:{value:o.modalAlta,callback:function(t){o.modalAlta=t},expression:"modalAlta"}},[i("q-card",{staticStyle:{"min-width":"400px"}},[i("q-item",{staticStyle:{"background-color":"black"}},[i("span",{staticClass:"q-subheading",staticStyle:{color:"white"}},[o._v("Nuevo Movimiento")])]),i("q-card-separator"),i("div",{staticStyle:{padding:"0 1rem 1rem 1rem"}},[i("div",{staticStyle:{display:"flex","flex-direction":"row","justify-content":"space-between","margin-top":"20px"}},[i("q-field",{style:o.movimientoAlta.Objetivo?"width:45%":"width: 100%",attrs:{label:"Caso:","stack-label":""}},[o._v(o._s(o.movimientoAlta.Caso))]),o.alta?o._e():i("q-field",{staticStyle:{width:"50%"},attrs:{label:"Objetivo: ","stack-label":""}},[o._v(o._s(o.movimientoAlta.Objetivo?o.movimientoAlta.Objetivo:"Sin Objetivo"))])],1),i("q-input",{attrs:{label:"Detalle del movimiento",type:"textarea",rows:3},model:{value:o.nuevoMovimiento.Detalle,callback:function(t){o.$set(o.nuevoMovimiento,"Detalle",t)},expression:"nuevoMovimiento.Detalle"}}),i("div",{staticStyle:{display:"flex","justify-content":"space-between","align-items":"end"}},[i("q-select",{staticStyle:{width:"47%"},attrs:{options:o.coloresDocDoc,label:"Estado de Gestión"},model:{value:o.nuevoMovimiento.colorSeleccionado,callback:function(t){o.$set(o.nuevoMovimiento,"colorSeleccionado",t)},expression:"nuevoMovimiento.colorSeleccionado"}}),i("q-input",{ref:"inputFechaEsperada",staticStyle:{width:"47%"},attrs:{label:"Fecha Esperada",rules:["date"]},scopedSlots:o._u([{key:"append",fn:function(){return[i("q-icon",{staticClass:"cursor-pointer",attrs:{name:"event"}},[i("q-popup-proxy",{ref:"qDateProxy1",attrs:{"transition-show":"scale","transition-hide":"scale"}},[i("q-date",{attrs:{mask:"DD-MM-YYYY"},on:{input:function(){return o.$refs.qDateProxy1.hide()},change:function(t){return o.editarFechaEsperada()}},model:{value:o.nuevoMovimiento.FechaEsperada,callback:function(t){o.$set(o.nuevoMovimiento,"FechaEsperada",t)},expression:"nuevoMovimiento.FechaEsperada"}})],1)],1)]},proxy:!0}],null,!1,2798027818),model:{value:o.nuevoMovimiento.FechaEsperada,callback:function(t){o.$set(o.nuevoMovimiento,"FechaEsperada",t)},expression:"nuevoMovimiento.FechaEsperada"}})],1),i("div",{staticStyle:{display:"flex","justify-content":"space-between","align-items":"end"}},[i("q-input",{ref:"inputFechaAlta",staticStyle:{width:"47%"},attrs:{label:"Fecha de estado de gestión",rules:["date"]},scopedSlots:o._u([{key:"append",fn:function(){return[i("q-icon",{staticClass:"cursor-pointer",attrs:{name:"event"}},[i("q-popup-proxy",{ref:"qDateProxy2",attrs:{"transition-show":"scale","transition-hide":"scale"}},[i("q-date",{attrs:{mask:"DD-MM-YYYY",label:"Fecha de estado de gestión"},on:{input:function(){return o.$refs.qDateProxy2.hide()},change:function(t){return o.editarFechaEsperada()}},model:{value:o.nuevoMovimiento.FechaAlta,callback:function(t){o.$set(o.nuevoMovimiento,"FechaAlta",t)},expression:"nuevoMovimiento.FechaAlta"}})],1)],1)]},proxy:!0}],null,!1,3438007495),model:{value:o.nuevoMovimiento.FechaAlta,callback:function(t){o.$set(o.nuevoMovimiento,"FechaAlta",t)},expression:"nuevoMovimiento.FechaAlta"}}),i("q-select",{staticStyle:{width:"47%"},attrs:{options:o.opcionesResponsable,label:"Responsable del movimiento"},model:{value:o.nuevoMovimiento.Responsable,callback:function(t){o.$set(o.nuevoMovimiento,"Responsable",t)},expression:"nuevoMovimiento.Responsable"}})],1),i("div",{staticStyle:{display:"flex","justify-content":"space-between","align-items":"end"}},[i("q-select",{staticStyle:{width:"47%"},attrs:{options:o.opcionesTipoMov,label:"Tipo de movimiento"},model:{value:o.nuevoMovimiento.TipoMov,callback:function(t){o.$set(o.nuevoMovimiento,"TipoMov",t)},expression:"nuevoMovimiento.TipoMov"}}),i("q-uploader",{staticStyle:{width:"47%"},attrs:{label:"Multimedia","auto-upload":"",multiple:""}})],1),i("div",{staticStyle:{"padding-top":"30px","text-align":"right"}},[i("q-btn",{attrs:{color:"primary"},on:{click:function(t){return o.guardarMovimiento()}}},[o._v("Guardar")]),i("q-btn",{attrs:{flat:""},on:{click:function(t){return o.cancelarAlta()}}},[o._v("Cancelar")])],1)],1)],1)],1):o._e(),o.cargandoCasos?o._e():i("q-dialog",{model:{value:o.modalCasos,callback:function(t){o.modalCasos=t},expression:"modalCasos"}},[i("q-card",[i("q-item",{staticStyle:{background:"black",color:"white","font-weight":"500"}},[i("q-item-side",{attrs:{left:"",color:"white",icon:"description"}}),i("span",{staticClass:"q-subheading"},[o._v("Casos")]),i("q-item-side",{staticStyle:{"margin-left":"auto"},attrs:{right:""}},[i("q-btn",{attrs:{flat:"",color:"white",icon:"close"},on:{click:function(t){o.modalCasos=!1}}})],1)],1),o._l(o.Casos,(function(t){return i("div",{key:t.IdCaso,staticStyle:{padding:"1rem 1rem 0 0"}},[!o.cargandoCasos&&o.modalCasos?i("TarjetaCaso",{attrs:{caso:t}}):o._e()],1)})),i("div",{staticStyle:{display:"flex","justify-content":"flex-end","margin-right":"40px"}},[i("q-btn",{attrs:{flat:"",color:"primary",label:"Cerrar"},on:{click:function(t){o.modalCasos=!1}}})],1)],2)],1),o.modalObjetivos?i("q-dialog",{model:{value:o.modalObjetivos,callback:function(t){o.modalObjetivos=t},expression:"modalObjetivos"}},[i("q-card",[i("q-list",{attrs:{highlight:""}},[i("q-item-label",{staticClass:"q-subheading",staticStyle:{background:"black",color:"white"},attrs:{header:""}},[o._v('Objetivos del caso "'+o._s(o.movimientoMostrarObjetivos.Caso)+'"')]),o._l(o.filtrarObjetivos(),(function(t){return i("q-item",{key:t.IdObjetivo,staticStyle:{display:"flex","align-items":"center","justify-content":"space-between"}},[i("q-item-label",[o._v(o._s(t.Objetivo))]),i("div",[i("q-btn",{attrs:{icon:"edit",color:"primary",flat:"",rounded:"",outline:""},on:{click:function(i){return o.edicionObjetivo(t)}}},[i("q-tooltip",{attrs:{anchor:"bottom middle",self:"top middle",offset:[10,0]}},[o._v("Editar Objetivo")])],1),o.movimientoMostrarObjetivos.Objetivo!==t.Objetivo?i("q-btn",{staticStyle:{cursor:"pointer"},attrs:{icon:"add",color:"primary",round:"",size:"xs"},on:{click:function(i){return o.asociarObjetivo(t)}}},[i("q-tooltip",{attrs:{anchor:"bottom middle",self:"top middle",offset:[10,0]}},[o._v("Asociar Objetivo")])],1):o._e(),o.movimientoMostrarObjetivos.Objetivo===t.Objetivo?i("q-btn",{staticStyle:{cursor:"pointer"},attrs:{icon:"clear",round:"",size:"xs",color:"primary"},on:{click:function(i){return o.desasociarObjetivo(t)}}},[i("q-tooltip",{attrs:{anchor:"bottom middle",self:"top middle",offset:[10,0]}},[o._v("Desasociar Objetivo")])],1):o._e()],1)],1)}))],2),o.movimientoMostrarObjetivos.Objetivo?o._e():i("q-item",{staticStyle:{display:"flex","justify-content":"space-between","align-items":"center"}},[i("q-item-label",{staticClass:"text-primary"},[o._v("Nuevo Objetivo")]),i("q-btn",{staticStyle:{cursor:"pointer"},attrs:{icon:"add",color:"warning",round:"",size:"xs"},on:{click:function(t){o.modalNuevoObjetivo=!0}}})],1),i("div",{staticStyle:{display:"flex","justify-content":"flex-end","margin-right":"40px"}},[i("q-btn",{attrs:{flat:"",color:"accent",label:"Ver movimientos"},on:{click:function(t){o.modalMovimientosDeObjetivo=!0}}}),i("q-btn",{attrs:{flat:"",color:"primary",label:"Cerrar"},on:{click:function(t){o.modalObjetivos=!1}}})],1)],1)],1):o._e(),o.editarObjetivo?i("q-dialog",{model:{value:o.editarObjetivo,callback:function(t){o.editarObjetivo=t},expression:"editarObjetivo"}},[i("q-card",[i("q-item",{staticStyle:{"background-color":"black",display:"flex","align-items":"center",color:"white"}},[i("q-icon",{staticStyle:{"margin-right":"1rem"},attrs:{color:"white",name:"timeline",size:"sm"}}),i("span",{staticClass:"q-subheading"},[o._v("Editar Objetivo")])],1),i("q-separator"),i("q-item",[i("q-input",{staticStyle:{margin:"2rem"},attrs:{type:"textarea",rows:"1","max-height":50,label:"Objetivo"},model:{value:o.objetivoEditar.Objetivo,callback:function(t){o.$set(o.objetivoEditar,"Objetivo",t)},expression:"objetivoEditar.Objetivo"}})],1),i("q-card-actions",{attrs:{align:"right"}},[i("q-btn",{attrs:{flat:"",color:"primary"},on:{click:function(t){return o.finalizarEdicionObjetivo()}}},[o._v("Guardar")]),i("q-btn",{attrs:{flat:""},on:{click:function(t){o.editarObjetivo=!1}}},[o._v("Cancelar")])],1)],1)],1):o._e(),o.modalMovimientosDeObjetivo?i("q-dialog",{model:{value:o.modalMovimientosDeObjetivo,callback:function(t){o.modalMovimientosDeObjetivo=t},expression:"modalMovimientosDeObjetivo"}},[i("q-card",[i("q-list",{attrs:{highlight:""}},[o.movimientoMostrarObjetivos.Objetivo?i("q-item",{staticStyle:{"background-color":"black"}},[i("span",{staticClass:"q-subheading",staticStyle:{color:"white"}},[o._v('Movimientos del objetivo "'+o._s(o.movimientoMostrarObjetivos.Objetivo)+'"')])]):i("q-item",{staticStyle:{"background-color":"black"}},[i("span",{staticClass:"q-subheading",staticStyle:{color:"white"}},[o._v("Movimientos sin objetivo asociado")])]),o._l(o.movimientosObjetivo(),(function(t){return i("q-item",{key:t.IdMovimientoCaso,staticStyle:{display:"flex","align-items":"center"}},[i("q-icon",{attrs:{name:"assignment",color:t.Color,size:"sm"}}),i("q-item-label",[o._v(o._s(t.Detalle))]),t.FechaRealizado?i("div",{staticStyle:{display:"flex","align-items":"center","flex-direction":"row","margin-left":"auto","justify-content":"space-between"}},[i("q-item-label",[o._v(o._s(o.diasRestantes(t,"realizado")))]),i("q-icon",{staticStyle:{"margin-left":"0.5rem"},attrs:{name:"check_circle",size:"sm",color:"positive"}})],1):t.FechaEsperada?i("div",{staticStyle:{display:"flex","align-items":"center","flex-direction":"row","margin-left":"auto","justify-content":"space-between"}},[o._v(o._s(o.parseDate(t.FechaEsperada)))]):o._e()],1)}))],2),i("div",{staticStyle:{display:"flex","justify-content":"flex-end","margin-right":"40px"}},[i("q-btn",{attrs:{flat:"",color:"primary",label:"Cerrar"},on:{click:function(t){o.modalMovimientosDeObjetivo=!1}}})],1)],1)],1):o._e(),o.modalNuevoObjetivo?i("q-dialog",{model:{value:o.modalNuevoObjetivo,callback:function(t){o.modalNuevoObjetivo=t},expression:"modalNuevoObjetivo"}},[i("q-card",[i("q-item",{staticStyle:{"background-color":"black",color:"white",display:"flex","align-items":"center"}},[i("q-icon",{staticStyle:{"margin-right":"1rem"},attrs:{color:"white",name:"timeline",size:"sm"}}),i("span",{staticClass:"q-subheading"},[o._v("Nuevo Objetivo")])],1),i("q-item",[i("q-input",{attrs:{label:"Nombre del objetivo"},model:{value:o.nuevoObjetivo.Objetivo,callback:function(t){o.$set(o.nuevoObjetivo,"Objetivo",t)},expression:"nuevoObjetivo.Objetivo"}})],1),i("q-card-actions",{attrs:{align:"end"}},[i("q-btn",{attrs:{color:"primary",label:"Aceptar"},on:{click:function(t){return o.asociarANuevoObjetivo()}}}),i("q-btn",{attrs:{flat:"",color:"primary",label:"Cancelar"},on:{click:function(t){o.modalNuevoObjetivo=!1}}})],1)],1)],1):o._e()],1)])},n=[],r=(i("f751"),i("c5f6"),i("28a5"),i("7514"),i("6762"),i("2fdb"),i("ac6a"),i("cadf"),i("06db"),i("456d"),i("a481"),function(){var o=this,t=o.$createElement,i=o._self._c||t;return i("div",{staticStyle:{width:"100%"}},[i("q-expansion-item",{staticClass:"whitebg shadow-1",attrs:{icon:"adjust",label:"Civil y comercial"}},[i("q-expansion-item",{attrs:{icon:"filter_1",label:"Primera nominación (3 mov)"}},[i("q-banner",{staticStyle:{"margin-top":".2em"},attrs:{type:"negative",avatar:"../statics/img/pipo-avatar.png"}},[i("div",{staticClass:"row float-left"},[i("div",{staticClass:"col-12"},[o._v("\n          10 caracteres de la caratula - "),i("strong",[o._v(" Expte: 3545/17 ")])]),i("div",{staticClass:"col-12"},[o._v("\n          Este movimiento es perentorio.. es URGENTE\n        ")])]),i("div",{staticClass:"float-right"},[o._v("\n        1 día.\n      ")])]),i("q-banner",{staticStyle:{"margin-top":".2em"},attrs:{color:"primary",avatar:"../statics/img/jorge-avatar.png"}},[i("div",{staticClass:"row float-left"},[i("div",{staticClass:"col-12"},[o._v("\n          10 caracteres de la caratula - "),i("strong",[o._v(" Expte: 3545/17 ")])]),i("div",{staticClass:"col-12"},[o._v("\n          Aca va el movimiento. Esta azul porque mi estudio tiene que gestionar algo.\n        ")])]),i("div",{staticClass:"float-right"},[o._v("\n        5 días.\n      ")])]),i("q-banner",{staticStyle:{"margin-top":".2em"},attrs:{type:"warning",avatar:"../statics/img/guido-avatar.png"}},[i("div",{staticClass:"row col-8 float-left"},[i("div",{staticClass:"col-12"},[o._v("\n          10 caracteres de la caratula - "),i("strong",[o._v(" Expte: 3545/17 ")])]),i("div",{staticClass:"col-8"},[o._v("\n          Aca va el movimiento. Está amarillo porque el que tiene que hacer algo es el juzgado o alguien ajeno a mi estudio. Debería poder tener un movimiento super largo aca por eso estoy llenando esto con caracteres para ver como se ve, no es mas que texto basura....\n        ")])]),i("div",{staticClass:"col-4 "},[o._v("\n        Vence hoy.\n      ")])]),i("q-banner",{staticStyle:{"margin-top":".2em"},attrs:{type:"positive",detail:"18/10/18 - Este fue el último movimiento y su fecha de realizado"}},[o._v("\n        Carátula de un juicio sin movimientos pendientes - "),i("strong",[o._v(" Expte: 3545/17 ")]),i("span",{staticStyle:{float:"right"}},[o._v(" Sin movimiento hace 5 días. ")])]),i("q-banner",{staticStyle:{"margin-top":".2em"},attrs:{type:"positive",detail:"18/10/18 - Este fue el último movimiento y su fecha de realizado"}},[o._v("\n        Carátula de OTRO juicio sin movimientos pendientes - "),i("strong",[o._v(" Expte: 3545/17 ")]),i("span",{staticStyle:{float:"right"}},[o._v(" Sin movimiento hace 85 días. ")])])],1),i("q-expansion-item",{attrs:{icon:"filter_2",label:"Segunda nominación (0 mov)"}},[i("q-banner",{staticStyle:{"margin-top":".2em"},attrs:{type:"positive"}},[i("strong",[o._v(" Expte: 3545/17 ")]),o._v(" - Carátula de un juicio sin movimientos pendientes.\n      ")]),i("q-banner",{staticStyle:{"margin-top":".2em"},attrs:{type:"positive"}},[i("strong",[o._v(" Expte: 3545/17 ")]),o._v(" - Carátula de otro juicio sin movimientos pendientes.\n      ")])],1)],1)],1)}),l=[],c={},v=c,d=(i("456e"),i("2877")),u=Object(d["a"])(v,r,l,!1,null,null,null),m=u.exports,p=i("8daa"),b=i("b628"),h=function(){var o=this,t=o.$createElement,i=o._self._c||t;return i("div",{staticClass:"contenedor shadow-2",style:{border:"1px solid "+this.borde}},[i("div",{staticClass:"temperatura",style:{"background-color":this.temperatura,height:this.altura+"%",border:"2px solid "+this.borde}}),i("p",{staticClass:"verticalP"},[o._v("Gestionómetro")]),i("q-tooltip",{style:{"background-color":this.temperatura,border:"1px solid "+this.borde},attrs:{self:"top left",anchor:"bottom right"}},[i("p",[o._v("Puntuación de su estudio: "+o._s(this.indigestion))]),i("p",[o._v("Puntuación promedio de su competencia: 0.9")]),i("p",[o._v("Si mejora su puntuación recibirá mas y mejores casos!")])])],1)},f=[],g=(i("6b54"),{methods:{colorear:function(o){var t=(120*(1-o)).toString(10);this.temperatura=["hsl(",t,",100%,43%)"].join(""),this.borde=["hsl(",t,",100%,40%)"].join("")}},data:function(){return{indigestion:.5,temperatura:"",altura:100,borde:""}},mounted:function(){this.indigestion=.7,this.altura=100*this.indigestion,this.colorear(this.indigestion)}}),M=g,j=(i("e9e4"),Object(d["a"])(M,h,f,!1,null,null,null)),E=j.exports,y=i("3a5e"),O=i("1f85"),C=i("7a13"),q=i("1fca"),x={extends:q["a"],props:{chardata:{type:Object,default:null},options:{type:Object,default:null}},mounted:function(){this.renderChart(this.chardata,this.options)}},T=x,_=Object(d["a"])(T,e,a,!1,null,null,null),A=_.exports,I=i("2a19"),S=i("24e8"),k={components:{MovimientosPendientes:m,TarjetaTribunales:O["a"],TarjetaCaso:C["a"],Gestionometro:E,Loading:y["a"],QDialog:S["a"],barChart:A},name:"Vencimientos",data:function(){return{nuevoObjetivo:{},modalMovimientosDeObjetivo:!1,modalNuevoObjetivo:!1,editarObjetivo:!1,objetivoEditar:{},objetivosMostrar:[],movimientoMostrarObjetivos:{},modalObjetivos:!1,Perentorios:[],GestionEstudio:[],Juzgados:[],filtrar:!1,movimientoAlta:{},cargandoMovimientos:!0,cargandoCasos:!0,Casos:[],alta:!1,nuevoMovimiento:{IdUsuario:0,TiposMov:[],TipoMov:0,UsuariosEstudio:[],IdEstudio:0,Detalle:"",FechaEsperada:"",FechaAlta:(new Date).toISOString(),colorSeleccionado:"",Caso:0,Objetivo:""},modalAlta:!1,modalCasos:!1,coloresDocDoc:[{label:"Perentorio",value:"negative"},{label:"Gestión Estudio",value:"primary"},{label:"Gestión Externa",value:"warning"},{label:"Finalizado",value:"positive"}],TipoMov:["Todos"],TiposMov:[],EstadoAmbito:["Todos"],EstadosAmbito:[],Usuario:["Todos"],Usuarios:[]}},created:function(){var o=this;this.Responsable=b["a"].UsuarioLogueado;var t=b["a"].UsuarioLogueado;this.IdResponsable=t.IdUsuario,this.nuevoMovimiento.Responsable={label:"".concat(t.Apellidos,", ").concat(t.Nombres),value:t.IdUsuario},this.IdEstudio=t.IdEstudio,p["a"].Get("/estudios/".concat(this.IdEstudio,"/tipos-movimiento"),{},(function(t){t.Error?o.$q.notify(t.Error):t.length?o.TiposMov=t:o.$q.notify("No hay tipos de movimiento disponibles para este estudio")})),p["a"].Get("/estado-ambito-gestion",{},(function(t){t.Error?o.$q.notify(t.Error):o.EstadosAmbito=t})),p["a"].Get("/estudios/".concat(this.IdEstudio,"/usuarios"),{},(function(t){t.Error?o.$q.notify(t.Error):t.length&&(o.Usuarios=t)})),p["a"].Get("/movimientos/vista-tribunales",{},(function(t){if(!t.Error){var i={},e=JSON.stringify(t.map((function(o){return o.IdCaso})));p["a"].Get("/objetivos?IdsCaso=".concat(e),{},(function(t){t.Error||o.Casos.forEach((function(o){o.Objetivos=t[o.IdCaso]}))})),p["a"].Get("/personas/casos?IdsCasos=".concat(e),{},(function(e){e.Error?I["a"].create(e.Error):(t.forEach((function(t){var a=[];for(var s in e)s===t.IdCaso&&(a=e[s]);var n={PersonasCaso:a,Caratula:t.Caratula,Carpeta:t.Carpeta,FechaAlta:t.FechaAlta,FechaUltVisita:t.FechaUltVisita,IdCaso:t.IdCaso,IdEstadoCaso:t.IdEstadoCaso,IdJuzgado:t.IdJuzgado,IdNominacion:t.IdNominacion,IdTipoCaso:t.IdTipoCaso,Juzgado:t.Juzgado,Nominacion:t.Nominacion,NroExpediente:t.NroExpediente,Observaciones:t.Observaciones,Tipo:t.Tipo,UsuariosCaso:t.UsuariosCaso};o.Casos.push(n),"B"!==t.Estado&&(t.Movimientos=JSON.parse(t.Movimientos),i[t.IdCaso]=t,t.Movimientos.forEach((function(i){i.CasoCompleto=t,i.IdUsuarioResponsable=o.IdResponsable,i.Juzgado=t.Juzgado,i.Nominacion=t.Nominacion,i.IdJuzgado=t.IdJuzgado,i.IdNominacion=t.IdNominacion,i.Detalle=i.Detalle.replace(/<\s*\/?\s*br\s*.*?>/g,"\n"),i.NroExpediente=t.NroExpediente,i.FechaRealizado||"N"===t.Tipo||("negative"===i.Color?o.Perentorios.push(i):"primary"!==i.Color&&"warning"!==i.Color||(-1===o.Juzgados.indexOf(t.Juzgado)&&o.Juzgados.push(t.Juzgado),i.Juzgado=t.Juzgado,o.GestionEstudio.push(i)))})))})),o.cargandoCasos=!1,o.Juzgados.sort(),o.Perentorios.sort((function(o,t){return o.FechaEsperada<t.FechaEsperada?-1:o.FechaEsperada>t.FechaEsperada?1:0})),o.GestionEstudio.sort((function(o,t){return o.FechaEsperada||t.FechaEsperada?o.FechaEsperada?t.FechaEsperada?o.FechaEsperada<t.FechaEsperada?-1:o.FechaEsperada>t.FechaEsperada?1:o.IdNominacion<t.IdNominacion?-1:o.IdNominacion>t.IdNominacion?1:0:-1:1:o.FechaAlta>t.FechaAlta?-1:o.FechaAlta<t.FechaAlta?1:-1})),p["a"].Get("/objetivos?IdsCaso=".concat(JSON.stringify(Object.keys(i))),{},(function(o){Object.keys(o).forEach((function(t){i[t].Objetivos=o[t]}))})))}))}o.cargandoMovimientos=!1}))},watch:{"nuevoMovimiento.FechaEsperada":function(o){var t=this;this.$nextTick((function(){t.$refs.inputFechaEsperada.innerErrorMessage||(t.$refs.inputFechaEsperada.innerError=!1)}))},"nuevoMovimiento.FechaAlta":function(o){var t=this;this.$nextTick((function(){t.$refs.inputFechaAlta.innerErrorMessage||(t.$refs.inputFechaAlta.innerError=!1)}))}},computed:{opcionesTipoMov:function(){var o=[];return this.modalAlta&&this.nuevoMovimiento.TiposMov&&this.nuevoMovimiento.TiposMov.length&&(o=this.nuevoMovimiento.TiposMov.map((function(o){return{label:o.TipoMovimiento,value:o.IdTipoMov}}))),o},opcionesResponsable:function(){var o=[];return this.nuevoMovimiento.UsuariosEstudio&&this.nuevoMovimiento.UsuariosEstudio.length&&(o=this.nuevoMovimiento.UsuariosEstudio.map((function(o){return{label:"".concat(o.Apellidos,", ").concat(o.Nombres),value:o.IdUsuario}}))),o},opcionesTiposMov:function(){var o=[];return this.TiposMov&&this.TiposMov.length&&(o.push("Todos"),this.TiposMov.forEach((function(t){o.push(t.TipoMovimiento)}))),o},opcionesEstadoAmbito:function(){var o=[];return this.EstadosAmbito&&this.EstadosAmbito.length&&(o.push("Todos"),this.EstadosAmbito.forEach((function(t){o.push({label:t.EstadoAmbitoGestion,value:t.IdEstadoAmbitoGestion})}))),o},opcionesUsuarios:function(){var o=[];return this.Usuarios&&this.Usuarios.length&&(o.push("Todos"),this.Usuarios.forEach((function(t){o.push(t.Apellidos+", "+t.Nombres)}))),o},filtrarMovGestion:function(){var o=this.GestionEstudio;return o=this.filtrarPorTipoMov(o),o=this.filtrarPorEstado(o),o=this.filtrarPorUsuario(o),o},filtrarPerentorios:function(){var o=this.Perentorios;return o=this.filtrarPorTipoMov(o),o=this.filtrarPorEstado(o),o=this.filtrarPorUsuario(o),o}},methods:{filtrarGestionEstudio:function(o){return this.GestionEstudio.filter((function(t){return t.Juzgado===o}))},filtrarPorTipoMov:function(o){var t=this;if(0!==this.TipoMov.length&&"Todos"!==this.TipoMov[this.TipoMov.length-1]||(this.TipoMov=["Todos"]),this.TipoMov.length>1&&this.TipoMov.includes("Todos")){var i=this.TipoMov.indexOf("Todos");this.TipoMov.splice(i,1)}return this.TipoMov.includes("Todos")||(o=o.filter((function(o){return t.TipoMov.includes(o.TipoMovimiento)}))),o},filtrarPorUsuario:function(o){var t=this;if(0!==this.Usuario.length&&"Todos"!==this.Usuario[this.Usuario.length-1]||(this.Usuario=["Todos"]),this.Usuario.length>1&&this.Usuario.includes("Todos")){var i=this.Usuario.indexOf("Todos");this.Usuario.splice(i,1)}return this.Usuario.includes("Todos")||(o=o.filter((function(o){return t.Usuario.includes(o.UsuarioResponsable)}))),o},filtrarPorEstado:function(o){var t=this;if(0!==this.EstadoAmbito.length&&"Todos"!==this.EstadoAmbito[this.EstadoAmbito.length-1]||(this.EstadoAmbito=["Todos"]),this.EstadoAmbito.length>1&&this.EstadoAmbito.includes("Todos")){var i=this.EstadoAmbito.indexOf("Todos");this.EstadoAmbito.splice(i,1)}return this.EstadoAmbito.includes("Todos")||(console.log(this.EstadoAmbito),o=o.filter((function(o){var i=o.CasoCompleto.IdEstadoAmbitoGestion;if(t.EstadoAmbito.find((function(o){return o.value===i})))return!0}))),o},formatearFecha:function(o){return o?o.split("T")[0]:null},parseDateTime:function(o){if(null!==o){var t=o.split(" "),i=t[0].split("-"),e=t[1].split(":");return"".concat(i[2],"/").concat(i[1],"/").concat(i[0]," ").concat(e[0],":").concat(e[1])}return null},parseDate:function(o){return null!==o?this.parseDateTime(o).split(" ")[0]:null},isMobile:function(){return!!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)},realizarMovimiento:function(o,t){var i=this;p["a"].Put("/movimientos/".concat(o.IdMovimientoCaso,"/realizar"),{},(function(t){if(t.Error)I["a"].create(t.Error);else{if("primary"===o.Color){i.GestionEstudio.splice(i.GestionEstudio.indexOf(o),1);var e=!1;i.GestionEstudio.forEach((function(t){t.Juzgado===juzgado&&t.IdMovimientoCaso!==o.IdMovimientoCaso&&(e=!0)})),!1===e&&i.Juzgados.splice(i.Juzgados.indexOf(juzgado))}else i.Perentorios.splice(i.Perentorios.indexOf(o),1);i.$q.notify({color:"green",message:"Se marcó como realizado el movimiento '".concat(o.Detalle,"'")}),i.movimientoAlta=o,i.altaMovimiento()}}))},altaMovimiento:function(){var o=this;this.modalAlta=!0,this.nuevoMovimiento.IdEstudio=b["a"].UsuarioLogueado.IdEstudio,p["a"].Get("/estudios/".concat(this.nuevoMovimiento.IdEstudio,"/usuarios"),{},(function(t){t.Error?o.$q.notify(t.Error):t.length&&(o.nuevoMovimiento.UsuariosEstudio=t)})),p["a"].Get("/estudios/".concat(this.nuevoMovimiento.IdEstudio,"/tipos-movimiento"),{},(function(t){t.Error?o.$q.notify(t.Error):t.length?(o.nuevoMovimiento.TiposMov=t,t.forEach((function(t){Number(t.IdTipoMov)===o.movimientoAlta.IdTipoMov&&(o.nuevoMovimiento.TipoMov={label:t.TipoMovimiento,value:t.IdTipoMov})}))):o.$q.notify("No hay tipos de movimiento disponibles para este estudio")}))},cancelarAlta:function(){this.modalAlta=!1,this.nuevoMovimiento={IdUsuario:0,TiposMov:[],TipoMov:0,UsuariosEstudio:[],IdEstudio:0,Detalle:"",FechaEsperada:"",FechaAlta:"",colorSeleccionado:{label:"Gestión Estudio",value:"primary"},Caso:0,Objetivo:"",Responsable:{}}},guardarMovimiento:function(){var o=this;if(this.nuevoMovimiento.Detalle||this.$q.notify("Debe ingresar el detalle del movimiento."),this.nuevoMovimiento.TipoMov||this.$q.notify("Debe elegir un tipo de movimiento."),""===this.nuevoMovimiento.colorSeleccionado)this.$q.notify("Debe seleccionar un estado de gestión");else{this.Casos.forEach((function(t){o.movimientoAlta.Caso===t.Caratula&&(o.nuevoMovimiento.IdCaso=t.IdCaso,o.nuevoMovimiento.NroExpediente=t.NroExpediente)}));var t=this.nuevoMovimiento.FechaEsperada,i=this.nuevoMovimiento.FechaAlta;this.nuevoMovimiento.FechaEsperada&&4===this.nuevoMovimiento.FechaEsperada.split("-")[2].length&&(t="".concat(this.nuevoMovimiento.FechaEsperada.split("-")[2],"-").concat(this.nuevoMovimiento.FechaEsperada.split("-")[1],"-").concat(this.nuevoMovimiento.FechaEsperada.split("-")[0])),this.nuevoMovimiento.FechaAlta&&4===this.nuevoMovimiento.FechaAlta.split("-")[2].length&&(i="".concat(this.nuevoMovimiento.FechaAlta.split("-")[2],"-").concat(this.nuevoMovimiento.FechaAlta.split("-")[1],"-").concat(this.nuevoMovimiento.FechaAlta.split("-")[0]));var e={IdResponsable:this.nuevoMovimiento.Responsable.value,Detalle:this.nuevoMovimiento.Detalle,IdCaso:this.nuevoMovimiento.IdCaso,FechaEsperada:this.formatearFecha(t),FechaAlta:this.formatearFecha(i),FechaRealizado:null,IdTipoMov:this.nuevoMovimiento.TipoMov.value,Cuaderno:this.movimientoAlta.Cuaderno,Color:this.nuevoMovimiento.colorSeleccionado.value,Multimedia:this.Multimedia};p["a"].Post("/movimientos",e,(function(t){t.Error?o.$q.notify(t.Error):(o.modalAlta=!1,o.$q.notify({color:"green",message:'El movimiento "'.concat(e.Detalle,'" se dio de alta correctamente')}),e.TipoMovimiento=o.nuevoMovimiento.TipoMov.label,e.Caso=o.movimientoAlta.Caso,e.CasoCompleto=o.caso,p["a"].Get("/casos/".concat(o.nuevoMovimiento.IdCaso,"/movimientos"),{},(function(t){if(!t.Error){var i=!0;t.forEach((function(t){if(t.Detalle===e.Detalle&&(e.IdMovimientoCaso=t.IdMovimientoCaso,!0===i&&!e.FechaRealizado))if(o.movimientoAlta.Objetivo){var a={};o.movimientoAlta.CasoCompleto.Objetivos.forEach((function(t){t.Objetivo===o.movimientoAlta.Objetivo&&(a=t)})),p["a"].Post("/movimientos/".concat(e.IdMovimientoCaso,"/asociar-objetivo/").concat(a.IdObjetivo),{},(function(t){e.Objetivo=a.Objetivo,o.MovimientosPendientes.push(e),o.Movimientos.push(e),i=!1}))}else o.MovimientosPendientes.push(e),o.Movimientos.push(e),i=!1})),o.altaFinalizada=!0,o.alta=!1,o.movimientoAlta={},o.nuevoMovimiento.IdUsuario=0,o.nuevoMovimiento.TiposMov=[],o.nuevoMovimiento.TipoMov=0,o.nuevoMovimiento.UsuariosEstudio=[],o.nuevoMovimiento.IdEstudio=0,o.nuevoMovimiento.IdResponsable=0,o.nuevoMovimiento.Detalle="",o.nuevoMovimiento.FechaAlta=(new Date).toISOString(),o.nuevoMovimiento.FechaEsperada=null,o.nuevoMovimiento.colorSeleccionado="primary",o.nuevoMovimiento.Caso=0}})))}))}},verCasos:function(){this.modalCasos=!0},mostrarObjetivos:function(o){var t=this;this.Casos.forEach((function(i){i.IdCaso===o.CasoCompleto.IdCaso&&(t.modalObjetivos=!0,t.movimientoMostrarObjetivos=o,t.objetivosMostrar=i.Objetivos)}))},filtrarObjetivos:function(){var o=this,t=[];return this.objetivosMostrar.forEach((function(i){o.movimientoMostrarObjetivos.Objetivo?i.Objetivo===o.movimientoMostrarObjetivos.Objetivo&&t.push(i):t.push(i)})),t},edicionObjetivo:function(o){this.objetivoEditar=o,this.editarObjetivo=!0},asociarObjetivo:function(o){var t=this;p["a"].Post("/movimientos/".concat(this.movimientoMostrarObjetivos["IdMovimientoCaso"],"/asociar-objetivo/").concat(o.IdObjetivo),{},(function(i){t.movimientoMostrarObjetivos.Objetivo=o.Objetivo,t.modalObjetivos=!1}))},desasociarObjetivo:function(o){var t=this;p["a"].Put("/movimientos/".concat(this.movimientoMostrarObjetivos["IdMovimientoCaso"],"/desasociar-objetivo/").concat(o.IdObjetivo),{},(function(o){o.Error?I["a"].create(o.Error):t.movimientoMostrarObjetivos.Objetivo=null,t.modalObjetivos=!1}))},finalizarEdicionObjetivo:function(){var o=this,t={Objetivo:this.objetivoEditar.Objetivo};p["a"].Put("/objetivos/".concat(this.objetivoEditar.IdObjetivo),t,(function(t){t.Error?I["a"].create(t.Error):(Object.defineProperty(o.filtrarObjetivos().filter((function(t){return t.IdObjetivo===o.objetivoEditar.IdObjetivo})),"Objetivo",{value:o.objetivoEditar.Objetivo}),o.editarObjetivo=!1,o.objetivoEditar={})}))},asociarANuevoObjetivo:function(){var o=this;this.nuevoObjetivo.IdCaso=this.movimientoMostrarObjetivos.CasoCompleto.IdCaso,p["a"].Post("/objetivos",this.nuevoObjetivo,(function(t){t.Error?o.$q.notify(t.Error):(o.objetivosMostrar.push(Object.assign({},o.nuevoObjetivo)),o.modalNuevoObjetivo=!1,p["a"].Post("/movimientos/".concat(o.movimientoMostrarObjetivos["IdMovimientoCaso"],"/asociar-objetivo/").concat(t.IdObjetivo),{},(function(t){t.Error?o.$q.notify(t.Error):(o.movimientoMostrarObjetivos.Objetivo=o.nuevoObjetivo.Objetivo,o.nuevoObjetivo.Objetivo="")})))}))}}},F=k,w=(i("d706"),Object(d["a"])(F,s,n,!1,null,null,null));t["default"]=w.exports},c553:function(o,t,i){},d706:function(o,t,i){"use strict";var e=i("d953"),a=i.n(e);a.a},d953:function(o,t,i){},e9e4:function(o,t,i){"use strict";var e=i("c553"),a=i.n(e);a.a}}]);