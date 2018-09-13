var sPath = window.location.pathname;
//var sPage = sPath.substring(sPath.lastIndexOf('\\') + 1);
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
console.log(sPage)
if (sPage == "house-page.html") {
    var url = 'https://api.propublica.org/congress/v1/113/house/members.json'
}
if (sPage == "senate-page.html") {
    var url = 'https://api.propublica.org/congress/v1/113/senate/members.json'
}
//alert(sPage)


var app =new Vue({

    el: '#vue-app',

    data: {

        headers: ["Name", "Party", "State", "Years in office", " % Votes with Party"],
        info: null,
        states: [],
        loading: true,
        textSelected: "",
        filterSelector: [],
        loaditems:false,
        names:[]

    },
    mounted() {
        {
            axios
                .get(url, {
                    headers: {
                        "X-API-Key": 'jvOLowNwJvd2uPy0QsdVozQwDGJ53E2OedCQHADO'
                    }
                })
                .then(response => {
                    app.info = response;
                    app.statebuilder();
                    //app.namebuilder()
                    app.loading = false;
//                    app.getWindowHeight()
                    app.loaditems = true;
                
                    
                })
            .catch(r => console.log(r))


        }


        this.$nextTick(function () {
            
            window.addEventListener('resize', this.getWindowWidth);
            window.addEventListener('scroll', this.getScrollPos);
            window.addEventListener('resize', this.getWindowHeight);


            //Init
            
            if (this.loading == false) {
                this.getWindowWidth()
                this.getScrollPos()
                this.getWindowHeight()
                
            }


            
        })
//        this.getWindowHeight()
    },

    methods: {
        at: function () {
            console.log(info)
        },
        statebuilder: function () {

            short = (this.info.data.results[0].members)
            states = []
            console.log(short)
            for (i = 0; i < short.length; i++) {
                stName = short[i].state

                if (states.indexOf(stName) < 0) {
                    states.push(stName)
                }
            }

            this.states = states.sort()

        },
        namebuilder: function (b) {
       
            if (b.middle_name == null) {

                name = b.first_name + " " + b.last_name
                //console.log(name)


            } else {
                name = b.first_name + " " + b.middle_name + " " + b.last_name
                
                //console.log(name)

            }
            
            return name
        },
        selector: function () {
            filterSelector = this.filterSelector;
            textSelected = this.textSelected;

            var rowLen = document.getElementById('senateTable').rows.length;

            var shortWay = document.getElementById('senateTable').rows[i]



            if (filterSelector.length == 0 && textSelected == '') {
                for (i = 0; i < rowLen; i++) {
                    document.getElementById('senateTable').rows[i].style.display = ''
                }
            } else if (filterSelector.length > 0 && textSelected == '') {
                for (i = 0; i < rowLen; i++) {
                    a = document.getElementById('senateTable').rows[i].cells[1].innerHTML
                    if (filterSelector.indexOf(a) < 0) {
                        document.getElementById('senateTable').rows[i].style.display = 'none';
                    } else {
                        document.getElementById('senateTable').rows[i].style.display = '';
                    }
                }
            } else if (filterSelector.length == 0 && textSelected != '') {
                for (i = 0; i < rowLen; i++) {
                    b = document.getElementById('senateTable').rows[i].cells[2].innerHTML;
                    if (b != textSelected) {

                        document.getElementById('senateTable').rows[i].style.display = 'none';
                    } else {

                        document.getElementById('senateTable').rows[i].style.display = '';
                    }
                }
            } else {
                for (i = 0; i < rowLen; i++) {
                    b = document.getElementById('senateTable').rows[i].cells[2].innerHTML
                    a = document.getElementById('senateTable').rows[i].cells[1].innerHTML
                    if (b != textSelected || filterSelector.indexOf(a) < 0) {

                        document.getElementById('senateTable').rows[i].style.display = 'none';
                    } else {

                        document.getElementById('senateTable').rows[i].style.display = '';
                    }
                }
            }
            this.getWindowHeight()
        },
        sorter: function (index) {
            var column_num = index;

            var rowLen = document.getElementById('senateTable').rows.length;
            var shortTable = document.getElementById('senateTable').rows

            for (i = 0; i < rowLen; i++) {
                for (j = i; j < rowLen; j++)

                { //console.log(i, val1)
                    var val1 = document.getElementById('senateTable').rows[i].cells[column_num].innerHTML
                    var val2 = document.getElementById('senateTable').rows[j].cells[column_num].innerHTML
                    //console.log(val1.toLowerCase(), val2.toLowerCase())
                    if (column_num == 3) {
                        if (Number(val1) > Number(val2)) {

                            shortTable[i].parentNode.insertBefore(shortTable[j], shortTable[i])
                        }
                    } else if (column_num == 4) {

                        val1 = val1.substr(0, val1.length - 2)
                        val2 = val2.substr(0, val2.length - 2)

                        if (Number(val1) > Number(val2)) {

                            shortTable[i].parentNode.insertBefore(shortTable[j], shortTable[i])
                        }

                    } else if (column_num == 0) {
                        val1 = $(val1).text()
                        val2 = $(val2).text()
                        if (val1.toLowerCase() > val2.toLowerCase()) {

                            shortTable[i].parentNode.insertBefore(shortTable[j], shortTable[i])
                        }
                    } else {
                        if (val1.toLowerCase() > val2.toLowerCase()) {

                            shortTable[i].parentNode.insertBefore(shortTable[j], shortTable[i])
                        }
                    }

                }
            }


        },
        getWindowWidth(event) {

            this.width = this.$refs.table.clientWidth;
            //console.log(this.width)
            $(".sticky").width(this.width)



        },
        getScrollPos(event) {
            this.getWindowWidth()
            //console.log($(window).scrollTop())
            var d = $('#tableId').offset().top;
            console.log($('#tableId').offset().top + "tabletop")
            console.log($(window).scrollTop() + "scroll")
            console.log($("#tableId").height() + "tableH")
            if (($(window).scrollTop() > d) && ($(window).scrollTop() < d + ($("#tableId").height()))) {
                $(".sticky").css({
                    "visibility": "visible"
                });
            } else {
                $(".sticky").css({
                    "visibility": "hidden"
                });
            };
        },


        getWindowHeight() {

            windowHeight = (window.innerHeight)
            var pageHeight = $("#height").height()
            //console.log(pageHeight,windowHeight)
            //<div class="navbar-fixed-bottom text-center">&copy; 2018 TGIF | All Rights Reserved </div>  
            if (windowHeight > pageHeight) {
                document.getElementById("footer").setAttribute("class", "navbar-fixed-bottom text-center")
            } else {
                document.getElementById("footer").setAttribute("class", "text-center")
            }


        },




    },
    beforeDestroy() {
        window.addEventListener('resize', this.getWindowWidth);
        window.addEventListener('scroll', this.getScrollPos);
        window.addEventListener('resize', this.getWindowHeight);

    },

})
