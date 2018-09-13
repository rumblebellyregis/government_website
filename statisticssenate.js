var sPath = window.location.pathname;
//var sPage = sPath.substring(sPath.lastIndexOf('\\') + 1);
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
console.log(sPage)
if(sPage=="house-attendance.html"){
    console.log("1")
   var  url='https://api.propublica.org/congress/v1/113/house/members.json'
}
else if(sPage=="senate-attendance.html"){
    console.log("2")
  var url='https://api.propublica.org/congress/v1/113/senate/members.json'
}
else if(sPage=="house-loyalty.html"){
    console.log("2")
  var url='https://api.propublica.org/congress/v1/113/house/members.json'
}
else{
    var url='https://api.propublica.org/congress/v1/113/senate/members.json'
}




"senate-loyalty.html"


var app = new Vue({

    el: '#vue-app',

    data: {
        info: null,
        sentNotMiss: null,
        sentMiss: null,
        sentLoyal: null,
        sentDisloyal: null,
        senAtteTable: null,
        loading: true,
        loaditems: false,
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
                    app.avarageBuilder();
                    app.dataGenerator();
                    app.loading = false;
                    

                })
                .catch(r => console.log(r))


        }
    },
    methods: {
        at: function () {
            console.log(this.sentMiss)
        },
        avarageBuilder: function () {
            shortCut = this.info.data.results[0].members;
            console.log(shortCut)

            var democrates = []
            var republicans = []
            var independents = []
            var total = []

            for (i = 0; i < shortCut.length; i++) {
                var party = shortCut[i].party
                if (party == "D") {
                    item = {}
                    item["vote_with_party"] = shortCut[i].votes_with_party_pct
                    item["mising_vote_prc"] = shortCut[i].missed_votes_pct

                    democrates.push(item)
                } else if (party == "R") {
                    item = {}
                    item["vote_with_party"] = shortCut[i].votes_with_party_pct
                    item["mising_vote_prc"] = shortCut[i].missed_votes_pct

                    republicans.push(item)

                } else {
                    item = {}
                    item["vote_with_party"] = shortCut[i].votes_with_party_pct
                    item["mising_vote_prc"] = shortCut[i].missed_votes_pct

                    independents.push(item)

                }
            }
            for (i = 0; i < shortCut.length; i++) {

                item = {}
                item["vote_with_party"] = shortCut[i].votes_with_party_pct
                item["mising_vote_prc"] = shortCut[i].missed_votes_pct
                total.push(item)
            }



            var senAtteTable = []
            array = [democrates, republicans, independents, total]
            var parties = ["Democrates", "Republicans", "Independents", "Total"]

            for (i = 0; i < array.length; i++) {
              

                var name = parties[i];
                var reps_number = array[i].length
                sum = 0
                for (j = 0; j < array[i].length; j++) {
                    sum = sum + array[i][j].vote_with_party
                }
                if (isNaN(sum / array[i].length)) {
                    var avareVote = "-"
                } else {
                    var avareVote = (sum / array[i].length).toFixed(2)+"%"
                }
              
                sum2 = 0
                for (j = 0; j < array[i].length; j++) {
                    sum2 = sum2 + array[i][j].mising_vote_prc
                }
                if (isNaN(sum2 / array[i].length)) {
                    var avareMiss = "-"
                } else {
                    var avareMiss = (sum2 / array[i].length).toFixed(2)+"%"
                }

                var item = {}
                item["name"] = name
                item["reps_number"] = reps_number
                 if (avareVote=="-"){
                    item["loyalty"]="-"}
                else{
                    item["loyalty"] = avareVote
                }
                
                if (avareMiss=="-"){
                    item["missing"]="-"}
                else{
                    item["missing"] = avareMiss
                }
                
                senAtteTable.push(item)

            }
            console.log(senAtteTable)
            this.senAtteTable=senAtteTable
        },
        dataGenerator: function () {
            shortCut = this.info.data.results[0].members

            senateLoyalty = []
            senateMissing = []
            for (i = 0; i < shortCut.length; i++) {
                //console.log((shortCut[i].votes_with_party_pct))
                //console.log((shortCut[i].missed_votes_pct))
                senateLoyalty.push(shortCut[i].votes_with_party_pct)
                senateMissing.push(shortCut[i].missed_votes_pct)
            }
            limit = shortCut.length / 10
            sortedSL = senateLoyalty.slice(0)
            reverseSSL = sortedSL.slice(0)
            reverseSSL = reverseSSL.reverse()
            sortedSM = senateMissing.slice(0)
            sortedSM = sortedSM.sort()
            reverseSSM = sortedSM.slice(0)
            reverseSSM = reverseSSM.reverse()


            function sorter(name) {
                var swap;
                var swapCount = 0;
                do {
                    for (var i = 1, swapCount = 0; i < name.length; i++) {
                        if (name[i - 1] > name[i]) {
                            swap = name[i - 1];
                            name[i - 1] = name[i];
                            name[i] = swap;
                            swapCount += 1;
                        }
                    }
                } while (swapCount > 0);
            }
            sorter(sortedSL)
            sorter(sortedSM)
            var leastMiss = []
            var mostMiss = []
            var mostLoyal = []
            var leastLoyal = []
            reverseSSM = sortedSM.slice(0)
            reverseSSM = reverseSSM.reverse()
            reverseSSL = sortedSL.slice(0)
            reverseSSL = reverseSSL.reverse()

            function indexer(name2, name3, name4) {
                for (i = 0; i < limit; i++) {

                    for (j = 0; j < name3.length; j++) {

                        if (name2[i] == name3[j] && name4.indexOf(j) < 0) {
                            name4.push(j)
                        }
                    }
                }
            }


            indexer(sortedSM, senateMissing, leastMiss)
            indexer(reverseSSM, senateMissing, mostMiss)
            indexer(sortedSL, senateLoyalty, mostLoyal)
            indexer(reverseSSL, senateLoyalty, leastLoyal)
            var name2Array = [sortedSM, reverseSSM, sortedSL, reverseSSL]
            var name3Array = [senateMissing, senateMissing, senateLoyalty, senateLoyalty]
            var name4Array = [leastMiss, mostMiss, mostLoyal, leastLoyal]

            console.log("allsorted", sortedSM)
            console.log("all", senateMissing)
            console.log("10%", leastMiss)

            //console.log(shortCut)

            name5Array = [leastMiss, mostMiss, mostLoyal, leastLoyal]

            sentNotMiss = []
            sentMiss = []
            sentLoyal = []
            sentDisloyal = []
            name5Array = [sentNotMiss, sentMiss, sentLoyal, sentDisloyal]

            function jsonGenerator(Array1, Array2) {
                //console.log(name4Array)
                for (i = 0; i < Array1.length; i++) {
                    //console.log(i)
                    var a = Array1[i]
                    //console.log(a)
                    var sentName = ''
                    if (shortCut[a].middle_name == null) {
                        sentName = shortCut[a].first_name + " " + shortCut[a].last_name
                    } else {
                        sentName = shortCut[a].first_name + " " + shortCut[a].middle_name + " " + shortCut[a].last_name
                    }


                    var sentname = sentName;
                    var sentLoyalty = shortCut[a].votes_with_party_pct
                    var sentMissVotes = shortCut[a].missed_votes;
                    var sentPrcntMissed = shortCut[a].missed_votes_pct
                    var sentVotes = shortCut[a].total_votes
                    var url = shortCut[a].url

                    item = {}
                    item["name"] = sentname;
                    item["miss_votes"] = sentMissVotes;
                    item["prcnt_missed"] = sentPrcntMissed;
                    item["sent_votes"] = sentVotes
                    item["vote_with_party"] = sentLoyalty
                    item["link"] = url

                    Array2.push(item);
                }
            }

            jsonGenerator(leastMiss, sentNotMiss)
            jsonGenerator(mostMiss, sentMiss)
            jsonGenerator(mostLoyal, sentLoyal)
            jsonGenerator(leastLoyal, sentDisloyal)
            console.log(sentMiss)
            this.sentNotMiss = sentNotMiss
            this.sentMiss = sentMiss
            this.sentLoyal = sentLoyal
            this.sentDisloyal = sentDisloyal
            this.loaditems=true

        }





    },






})
