/** Quiet original procedural soundscape; created only after a player gesture. */
export class ShopAudio {
 private context?:AudioContext;
 private rain?:AudioBufferSourceNode;
 private atmosphere?:GainNode;
 private unavailable=false;
 private level=0;
 unlock(){
  if(this.unavailable)return;
  try{
   if(!this.context){
    const context=this.context=new AudioContext();
    const buffer=context.createBuffer(1,context.sampleRate*6,context.sampleRate),data=buffer.getChannelData(0);
    let rng=90421,soft=0;
    for(let i=0;i<data.length;i++){rng=(Math.imul(rng,1664525)+1013904223)>>>0;soft=(soft+(rng/4294967296*2-1)*.08)/1.08;data[i]=soft*3;}
    const source=this.rain=context.createBufferSource();source.buffer=buffer;source.loop=true;
    const high=context.createBiquadFilter();high.type='highpass';high.frequency.value=350;
    const low=context.createBiquadFilter();low.type='lowpass';low.frequency.value=2100;
    const gain=this.atmosphere=context.createGain();gain.gain.value=0;
    source.connect(high).connect(low).connect(gain).connect(context.destination);source.start();
   }
   if(this.context.state==='suspended')void this.context.resume().catch(()=>{});
  }catch{this.unavailable=true;}
 }
 setAtmosphere(level:number){this.level=level;if(this.context&&this.atmosphere){this.atmosphere.gain.cancelScheduledValues(this.context.currentTime);this.atmosphere.gain.setTargetAtTime(level,this.context.currentTime,.25);}}
 cue(kind:string,volume:number){
  const context=this.context;if(!context||context.state!=='running'||volume<=0)return;
  const notes=kind==='error'?[174]:kind==='repair'?[540,810]:kind==='arrival'?[660,520]:kind==='day'?[330,440,550]:kind==='success'?[440,550,660]:[520,780];
  notes.forEach((frequency,index)=>{
   const osc=context.createOscillator(),gain=context.createGain(),at=context.currentTime+index*.08;
   osc.type='sine';osc.frequency.value=frequency;
   gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume*.1,at+.008);gain.gain.exponentialRampToValueAtTime(.0001,at+.28);
   osc.connect(gain).connect(context.destination);osc.start(at);osc.stop(at+.3);osc.onended=()=>{osc.disconnect();gain.disconnect();};
  });
 }
 status(){return {state:this.unavailable?'unavailable':this.context?.state??'locked',ambienceLevel:this.level};}
 close(){this.rain?.stop();void this.context?.close();this.context=undefined;this.atmosphere=undefined;this.rain=undefined;}
}
