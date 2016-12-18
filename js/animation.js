// create Animation object
createAnimation = function() {

  let walk = false;
  let walk_start = 0;
  let walk_frame = 0;
  let walk_frame_duration = 125; // in milliseconds


  // let punch = false;
  // let punch_start = 0;
  // let punch_frame = 0;
  let attack_frame_duration = 50; // in milliseconds


  let death_duration = 500; // in milliseconds

  let facing;


  let updateWalkAnimation = function(character, now) {
    let anim = character.animation;
    if (character.getState()[1] == 2) {
      if (!anim.walk) {
        anim.walk_start = now; // reset start of walking animation
        anim.walk = true;
      }
      anim.walk_frame = (Math.floor((now - anim.walk_start) % (walk_frame_duration*8) / walk_frame_duration));

    } else { // no walking -> either do not update, or stop animation
      if (anim.walk) { // was walking but stopped
        anim.walk = false;
        anim.walk_frame = 0;
      }
    }
  }

  let updateAttackAnimation = function(character, now) {
    let anim = character.animation;
    if (character.getState()[1] == 3) {
      if (!anim.attack) {
        anim.attack_start = now; // reset start of walking animation
        anim.attack = true;
      }
      anim.attack_frame = (Math.floor((now - anim.attack_start) % (attack_frame_duration*3) / attack_frame_duration));

    } else { // no walking -> either do not update, or stop animation
      if (anim.attack) { // was walking but stopped
        anim.attack = false;
        anim.attack_frame = 0;
      }
    }
  }

  let updateDeathAnimation = function(character, now) {

    if (character.getState()[1] == 4) {
      console.log("dying");
      let anim = character.animation;
      if (!anim.death) {
        anim.death_start = now; // reset start of walking animation
        anim.death = true;
      }
      anim.h = 1.0 - (now - anim.death_start)/death_duration;
      if ((now - anim.death_start) >= death_duration) {
        anim.h = 1.0;
        anim.death = false;
        character.finishDeath();
        // anim.hide();
      }
    }
  }

  return {
    getCharacterFrame: (character) => {
      if (character.animation.attack) {
        let ox = character.getState()[0]*0.375+character.animation.attack_frame*0.125+0.250;
        return [
          ox, 0.0,  ox+0.125, 0.0,  ox+0.125, 0.125, ox, 0.125
        ];
      } else if (character.animation.walk) {
        let ox = character.animation.walk_frame*0.125;
        let oy = character.getState()[0]*0.125+0.125;
        return [
          ox, oy,  ox+0.125, oy,  ox+0.125, oy+0.125, ox, oy+0.125
        ];
      } else {
        let ox = character.getState()[0]*0.125;
        return [
          ox, 0.0,  ox+0.125, 0.0,  ox+0.125, 0.125,  ox, 0.125
        ];
      }
    },
    update: (game, now) => {
      updateWalkAnimation(game.player, now);
      updateAttackAnimation(game.player, now);
      updateDeathAnimation(game.player, now);
      game.enemies().forEach(function(enemy){
        updateWalkAnimation(enemy, now);
        updateAttackAnimation(enemy, now);
        updateDeathAnimation(enemy, now);
      });

      // updateattackAnimation(now, state[1] == 3);
      // facing = state[0];
    }
  }

}
