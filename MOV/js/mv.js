var mv_txt_box1 = document.querySelector("#mv_bg1 .mv_text");
var mv_txt_box2 = document.querySelector("#mv_bg2 .mv_text");
var mv_txt_box3 = document.querySelector("#mv_bg3 .mv_text");
var mv_txt_box4 = document.querySelector("#mv_bg4 .mv_text");
var mv_txt_box5 = document.querySelector("#mv_bg5 .mv_text");
var mv_txt_box6 = document.querySelector("#mv_bg6 .mv_text");
var mv_txt_box7 = document.querySelector("#mv_bg7 .mv_text");
var mv_txt_box8 = document.querySelector("#mv_bg8 .mv_text");

var sp_txt_box1 = document.querySelector("#sp_text1");
var sp_txt_box2 = document.querySelector("#sp_text2");
var sp_txt_box3 = document.querySelector("#sp_text3");
var sp_txt_box4 = document.querySelector("#sp_text4");

var rc_txt_box0 = document.querySelector("#rc_box1_text");
var rc_txt_box1 = document.querySelector("#rc_text1");
var rc_txt_box2 = document.querySelector("#rc_text2");
var rc_txt_box3 = document.querySelector("#rc_text3");

var fo_txt_box = document.querySelector("#fo_txt_box");


function txtin() {
    mv_txt_box1.innerHTML = `
    <h3>
        Harry Potter, who seems to be an ordinary orphan, is actually a magician. After
        entering Hogwarts College, Harry became a freshman in Gretchen, and became good
        friends with Rong En and Miao Li. On the other hand, an evil conspiracy quietly grows in the peaceful Hogwarts.
        Can the protagonist and his partner destroy the evil conspiracy to seize the magic stone and conquer the world ?
    </h3>
    `;

    mv_txt_box2.innerHTML = `
    <h3>
    It is rumored that the founder of Slytherin College built a secret room in Hogwarts College, and raised a fierce Warcraft in it. 
    When he left the campus, Warcraft became a parting gift and remained. 
    At the beginning of the new semester, many students have been killed, and even the professor has become a victim of the curse. 
    Miao Li has also been petrified. Can the protagonist break the spell and save the friend ?
    </h3>
    `;

    mv_txt_box3.innerHTML = `
    <h3>
    Azkaban, a prison that frightens all wizards, it is said that no matter how powerful the black wizard is, they can only do nothing like a mortal, but such an unbreakable prison has failed!
    Rumors of Buddha and Land Devil Sirius successfully escape. He brought deep fear to the magic world, and Harry Potter was the target he locked. What kind of crisis will the protagonist face ?
    </h3>
    `;

    mv_txt_box4.innerHTML = `
    <h3>
    The Hogwarts School of Magic is about to hold the "Three Witch Fighting Contest", which has been suspended for many years. The teachers and students of the school were very excited about this. When Harry Potter accidentally became the fourth fighter selected by the Cup
    he has been stared at by the servants of the Lord Voldemort, ready to hunt for the "blood of the enemy", can Harry, the youngest contestant, stand the test of the fire cup ?!
    </h3>
    `;

    mv_txt_box5.innerHTML = `
    <h3>
    The Buddha returned, but those in power refused to face the reality, and Dumbledore assisted in concealing to avoid the panic that caused the magic world. Harry knew that escape would only face a greater crisis, so he secretly called young wizard students Study together
    how to fight black magic
    </h3>
    `;

    mv_txt_box6.innerHTML = `
    <h3>
    People finally remembered the terribleness of the Buddha and the land, Dumbledore took Harry to search for the weakness of the demon king, and finally learned his secret of immortality, at the same time, the dark minions secretly mixed into Hogwarts,
    The lurking spies finally showed their true colors, which caused great damage to Harry Potter and others, and they lost the strongest fortress on the eve of the decisive battle
    </h3>
    `;

    mv_txt_box7.innerHTML = `
    <h3>
    It is said that the god of death left three sacred things in the world. When these three treasures are collected at the same time, he will become the master of the world. The Buddha and the Demon finally achieved the most powerful wand.
    Who is the master of the world, can Harry escape the chases of the black wizards and break through the weakness of the Lord Voldemort demon ?
    </h3>
    `;

    mv_txt_box8.innerHTML = `
    <h3>
    At the end of the war, the Black Wizards camp almost achieved a comprehensive victory. At the same time, Harry also successfully completed his mission. Lord Voldemort is no longer immortal. The final battle is whether Harry can lead people to break despair. Ushering in the dawn of peace?
    </h3>
    `;


    sp_txt_box1.innerHTML += `
    <h2>Wizard</h2>
    <h3>
    Humans born with magical powers can learn to transform power into magic. Wizards are divided into pure and mixed breeds. Purebred wizards take pride in their pure bloodlines and despise mixed-race wizards and other creatures
    </h3>
    `;

    sp_txt_box2.innerHTML += `
    <h2>Goblins</h2>
    <h3>
    They are second only to wizards in the magical world. Unlike home elves, they have higher intelligence and are mainly engaged in banking and services. Although they are smart, they have a bad heart and are self-interested creatures
    </h3>
    `;

    sp_txt_box3.innerHTML += `
    <h2>Mortal</h2>
    <h3>
    For human beings without magic, only a few people know the magic world. Therefore, most people regard magic as a magic spell because they are ignorant and easily deceived. Mortals are generally weak and arrogant
    </h3>
    `;

    sp_txt_box4.innerHTML += `
    <h2>Magic creature</h2>
    <h3>
    The legendary creatures that are contained in the legends of the human world and actually exist in the magical world. The materials of many magical props are taken from the magical beast
    </h3>
    `;


    rc_txt_box0.innerHTML += `
    <h3>
    Harry Potter's charm lies in gorgeous magic, cool magic props, and fabulous magical creatures. In addition, the protagonist meets nasty classmates, frightening teachers, and establishes revolutionary emotions with partners on campus. And participating in school teams for honor,This makes readers feel a strong resonance, as if they can bring themselves into the role of protagonist, and adventure together in the magical world of fantasy
    </h3>
    `;

    rc_txt_box1.innerHTML += `
    <h3>
    Come to the Harry Potter Park in Universal Studios and experience the magic of the magical world for yourself!
    </h3>
    `;

    rc_txt_box2.innerHTML += `
    <h3>
    Harry Potter also has opera! It will bring you a different experience than the movie, to experience the feast of sight and hearing!
    </h3>
    `;

    rc_txt_box3.innerHTML += `
    <h3>
    If you are fascinated by the story of Harry Potter, you must not miss the solid books with original content.
    </h3>
    `;


    fo_txt_box.innerHTML = `
    <h2>
    Only use for learning, if images or materials on the web are a violation of rights
    </h2>
    <h3>
    Please contact me by mail: leo01817@gmail.com
    </h3>
    `
};

txtin();

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    player1 = new YT.Player("mv_1", {
        videoId: "z86aFALzjgs",
    });
    player2 = new YT.Player("mv_2", {
        videoId: "GQAxGb5njBk",
    });
    player3 = new YT.Player("mv_3", {
        videoId: "-S79A0gIZSE",
    });
    player4 = new YT.Player("mv_4", {
        videoId: "_i0EN_YHdYA",
    });
    player5 = new YT.Player("mv_5", {
        videoId: "33a71C3Lu1c",
    });
    player6 = new YT.Player("mv_6", {
        videoId: "kjcVKktMQyo",
    });
    player7 = new YT.Player("mv_7", {
        videoId: "-OlqC5ccf8Q",
    });
    player8 = new YT.Player("mv_8", {
        videoId: "elzexPsoG_k",
    });

}