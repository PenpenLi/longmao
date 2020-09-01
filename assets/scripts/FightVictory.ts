/*
    Declare:战斗胜利类
    Date:2014/5/7
    **/

import { AudioMgr } from "./AudioMarger";
import { SDK } from "./platform/SDK";
import { Def } from "./frameworks/Def";
import { PlatformManager, Platform } from "./platform/PlatformManager";


export class FightVictory {
    private FightScene;
    private txt_gold;
    private earnStar = 0
	private earnGem = 0
    private earnGold = 0
    private _count_stars = 0
    private _count_gems = 0
    private _count_golds = 0
    private resource = null
    private isDouble = true

     // 构造方法
     constructor(scene:any) {
        cc.log("构造战斗胜利类=============>")
        this.FightScene = scene


   
        this.creatBullet()
        return this
     }

     creatBullet(){
        var CanvasNode = cc.find( 'Canvas' );
        if( !CanvasNode ) { cc.log( 'find Canvas error' ); return; } 
        var that = this

        var onResourceLoaded = function(errorMessage, loadedResource )
        {
            if( errorMessage ) { cc.log( 'Prefab error:' + errorMessage ); return; }
            if( !( loadedResource instanceof cc.Prefab ) ) { cc.log( 'Prefab error' ); return; } 
            var resource = cc.instantiate( loadedResource );
            that.FightScene.node.addChild(resource,100)
            //bullet.setPosition(that.battery.node.position.x,that.battery.node.position.y)
            that.resource = resource


            var next_btn = resource.getChildByName("next_btn")
            next_btn.on("touchend", (event) => {   // 双倍领取
                SDK.getInstance().ShowVideoAd(() => {
                    var curGolds = cc.sys.localStorage.getItem("CurrentGolds")
                    if(that.isDouble == true){
                        cc.sys.localStorage.setItem("CurrentGolds",Number(curGolds) + 100*2)
                    }else{
                        cc.sys.localStorage.setItem("CurrentGolds",Number(curGolds) + 100)
                    }

                    that.FightScene.updateFightUI()
                    resource.removeFromParent()
                    that.FightScene.goHome()
                }, Def.videoType.video_score);
             }, this);



             var nothanksNode = resource.getChildByName("nothanksNode")
             var callback = cc.callFunc(function () {
                nothanksNode.active =  true
             })
     
             var action = cc.sequence(cc.delayTime(3),callback)
             resource.runAction(action)



             nothanksNode.on("touchend", (event) => {   //  普通领取
                var curGolds = cc.sys.localStorage.getItem("CurrentGolds")
                cc.sys.localStorage.setItem("CurrentGolds",Number(curGolds) + 100)
                that.FightScene.updateFightUI()

                resource.removeFromParent()
                that.FightScene.goHome()

             }, this);



             //关卡加1下一关
             var lastSaevGates = cc.sys.localStorage.getItem("CurrentGates");
             var currentGates = Number(lastSaevGates) + 1
             cc.sys.localStorage.setItem("CurrentGates",Number(currentGates));


             var share_btn = resource.getChildByName("share_btn")
             // 抖音录屏功能
             if(PlatformManager.CurrentPlatform == Platform.BYTEDANCE){
                share_btn.active = true
            }

            // 分享录屏
            share_btn.on("touchend", function (event) {
                console.log("点击分享录屏=============>")
                PlatformManager.getInstance().shareVideo()
            }, this);



            // 双倍复选框
            var doubleGet = resource.getChildByName("doubleGet")
            doubleGet.on('toggle', that.callback1, that);








             AudioMgr.getInstance().playEffect("BGM003");
             AudioMgr.getInstance().playEffect("SE012");

        };
        cc.loader.loadRes('prefab/FightVictory', onResourceLoaded );
    }


   
    callback1 (event) {
        var toggle = event;
        //do whatever you want with toggle
        var textlabel = this.resource.getChildByName("next_btn").getChildByName("textlabel").getComponent(cc.Label)

        if(toggle.isChecked){
            textlabel.string = "双倍领取"
            this.isDouble = true
        }else{
            textlabel.string = "好的！"
            this.isDouble = false

        }
    }


     


}
