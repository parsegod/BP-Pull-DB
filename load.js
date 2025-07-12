document.addEventListener('DOMContentLoaded', function() {
      console.log('DOMContentLoaded fired. Script execution started.');

      const loadingScreen = document.getElementById('loadingScreen');
      const loadingBar = document.getElementById('loadingBar');
      const loadingText = document.getElementById('loadingText');
      const loadingAssetText = document.getElementById('loadingAssetText');
      const mainContent = document.getElementById('mainContent');
      const videoBackground = document.querySelector('.video-background');
      const videoElement = document.getElementById('backgroundVideo');
      const loadingLogo = document.getElementById('loadingLogo');

      const loadingMessageDisplayDelay = 700; 

      const assetsToLoad = [
    { url: 'https://files.catbox.moe/pucbmh.png', type: 'image'}, 
    { url: 'assets/wallpaper.mp4', type: 'video'}, 
    { url: 'assets/wallpaper.mp4', type: 'video'}, 
    { url: 'assets/weapon.json', type: 'json'},
    { url: 'package.json', type: 'json'},
    { url: 'vercel.json', type: 'json'},
    { url: 'index.html', type: 'file'},
    { url: 'README.md', type: 'md'},
    { url: 'script.js', type: 'js'},
    { url: 'style.css', type: 'css'},
    { url: 'assets/blueprints/images/9MM PM/CRACKED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/9MM PM/FIRECRACKER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/9MM PM/MAJOR GIFT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/9MM PM/SCRUB.jpg', type: 'image'},
    { url: 'assets/blueprints/images/9MM PM/THRONEBUSTER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/APHELION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/BLOODFANG.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/DEFILADE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/GOOD VIBES.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/PEEL OUT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/PREY DISPLAY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AEK-973/RECONCILIATION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/BLACKCELL VITRIOL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/CHAOS SOW.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/EXILES RESOLVE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/GRATITUDE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/MARINE MENAGERIE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/NULL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/PAYBACK.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/PURIFIER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/SINGLE ISSUE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/TATTERED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/VITRIOL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AK-74/YEEHAW.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/ALL CHIPPED OUT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/ASSAULT ACCESSORY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/BLACKCELL CLOVERLEAF.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/CLASSIFIED ARSENAL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/CLOVERLEAF.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/COUNTDOWN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/DREAM TRANCE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/EXTENDED ENERGY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/GO WITH THE FLOW.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/HONOR CLASH.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/ISLAND VIBES.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/MIDNIGHT MIRAGE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/MOST WANTED MVP.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/NEON LIGHTS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/PLAGUE DOCTOR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/PRO ISSUE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/RELENTLESS FORCE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/RETRO.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/ROBODILE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/SEAWORTHY STRENGTH.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/SPRINKLED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/THE ATOMIZER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/THE REDACTOR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMES 85/TRUTH SERUM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMR MOD 4/BATTERING RAM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMR MOD 4/BLACKCELL BLACKSMOKE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMR MOD 4/COILED STRIKE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMR MOD 4/DETHRONED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMR MOD 4/HIGH SIGHT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMR MOD 4/HOMEGROWN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMR MOD 4/HUSH HUSH.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AMR MOD 4/IRON RAIN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AS VAL/CANNIBAL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AS VAL/DREADFIN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AS VAL/DREADHORN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AS VAL/GREENHOUSE GRASSES.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AS VAL/ICEBITE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AS VAL/INDUSTRIAL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AS VAL/PACK LEADER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AS VAL/QUICK WIT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AS VAL/RAPIER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/AS VAL/RIPPLE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/AUTUMN AUTO.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/BATTLEWAX.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/BLACKCELL PYTHONICUS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/BLACKCELL SHATTER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/EMBERSCALD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/INSOMNIA.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/LIFELINE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/MOTHER CLUCKER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/PYTHONICUS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/SEVERER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/SHATTER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/TURMOIL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/ASG-89/VIOLATION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/CHICANE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/DEMOTED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/FAN MADE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/GOLD STANDARD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/HARDWIRE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/HOWLER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/KILL SWITCH.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/LIARS GAMBIT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/SUBVERTER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/SWEET TREAT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/TANK.jpg', type: 'image'},
    { url: 'assets/blueprints/images/C9/TEDDY IS A LIAR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CIGMA 2B/FINE COLUMN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CIGMA 2B/SCREAMING THUNDER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CR-56 AMAX/BLACKCELL VERDUROUS MENACE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CR-56 AMAX/GAME OVER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CR-56 AMAX/GLAZED OUT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CR-56 AMAX/SEA CHOMPER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CR-56 AMAX/VERDUROUS MENACE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CYPHER 091/BACON WRAPPED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CYPHER 091/BANDAGED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CYPHER 091/BLACKCELL DEATH BLOW.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CYPHER 091/DALE!.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CYPHER 091/DEATH BLOW.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CYPHER 091/PLAYBOOK.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CYPHER 091/SCARRED VETERAN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/CYPHER 091/STREAM TEAM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/D1.3 SECTOR/BATTLE RECORD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/D1.3 SECTOR/SLICED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/D1.3 SECTOR/UNCONSCIOUS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/BLACKCELL CHROMEWING.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/CHROMEWING.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/FINAL SAY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/FURBISHED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/HALBERD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/ON CALL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/ROBOT ABOMINATION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/SLUICEGATE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/STOCKING SUFFER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/THE CURATOR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/DM-10/THREATENING HOWL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/FENG 82/BLACKCELL CONFLICT VICTOR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/FENG 82/BLACKCELL TOURNIQUET.jpg', type: 'image'},
    { url: 'assets/blueprints/images/FENG 82/CONFLICT VICTOR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/FENG 82/GET LUCKY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/FENG 82/GUMMY DISASTER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/FENG 82/K9 UNIT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/FENG 82/K9-UNIT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/FENG 82/SHRED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/FENG 82/TOURNIQUET.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GOBLIN MK 2/BLACKCELL BOILING POINT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GOBLIN MK 2/BROAD HAMMER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GOBLIN MK 2/COLD SMOLDER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GOBLIN MK 2/FIELD WORK.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GOBLIN MK 2/FIRST RESPONDER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GOBLIN MK 2/MENACE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GOBLIN MK 2/POLAR RIP.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GOBLIN MK 2/PROPER GENTLEMAN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GOBLIN MK 2/TIP THE SCALES.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GOBLIN MK 2/USHERED PEACE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPMG-7/BIG BRAINED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPMG-7/BLACKCELL DAMASCUS RELOADED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPMG-7/BLACKCELL HITHER SLITHER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPMG-7/BLUNT TRAUMA.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPMG-7/DAMASCUS RELOADED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPMG-7/DEAD END.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPMG-7/ENCRYPTED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPMG-7/EXO-ORGANISM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPMG-7/HITHER SLITHER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/BLACKSPINE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/CORONER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/DONT MOVE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/ETERNAL STRIFE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/GINGER DREAD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/HIDEOUT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/JUNGLE GROWL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/RAMPAGER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/RETALIATOR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/VAULT SECURITY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GPR 91/WOLFCALL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GREKHOVA/BRUTAL STING.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GREKHOVA/LAPPED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GREKHOVA/OMERTA.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GREKHOVA/PLAN B.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GS45/CURATOR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GS45/CUSTODIAN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GS45/FATE MAKER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GS45/SUNBURST.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GS45/TIDE TURNER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GS45/VIPEROUS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/GS45/WATERWORKS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/HDR/BLACKCELL GLINT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/HDR/GLINT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/HDR/NAUTILOID.jpg', type: 'image'},
    { url: 'assets/blueprints/images/HDR/RED CARD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/HE-1/CHOICEST.jpg', type: 'image'},
    { url: 'assets/blueprints/images/HE-1/VOLTAGE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/AKUMU KITSUNE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/BANANA SPLITTIN DOMES.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/BASS BOOST.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/BLACKCELL BONESHARD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/BLOOD DRAW.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/CHRONIC UNAPOLOGETIC.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/CRIMSON ISSUE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/DIAMOND ISSUE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/DIMENSIONS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/GAME GUARD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/GILLED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/GOLD ISSUE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/IRIDESCENT ISSUE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/PAINBOW.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/PLATINUM ISSUE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/POCKET ACE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/POTENT CURIO.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/PRO ISSUE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/SCOURGE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/THE ROAR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/TOP 250 ISSUE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/JACKAL PDW/VMP ELITE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KILO 141/BARRELED BARRAGE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KILO 141/DRAGON EMBLEM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KILO 141/PHANTOM FENRIR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/BLING BLING.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/EXQUISITOR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/GOLDEN CALF.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/HALFPIPE HANDLER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/RADICAL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/SATIN SLAYER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/SCRAPPER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/SHUSH.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/STARS ALIGN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/STRIKE ORDER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KOMPAKT 92/WILDLIFE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/BAD BEAT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/BLACKCELL BAD BEAT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/BLUNTMAN STUNTMAN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/BOMBAST.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/DICER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/HAWKWING.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/IDIOPATHIC.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/LAYERED FINISH.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/RULE MASTER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/SEASONAL AGGRESSION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/SERRATED DENTICLE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KRIG C/SILVERBITE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KSV/BACON GRILLER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KSV/BONGSHOT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KSV/FAIR DINKUM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KSV/GUARD DUTY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KSV/INFESTATION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KSV/LONG BOMB.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KSV/MAGICAL WHIFF.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KSV/POCUS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/KSV/PURIFIER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LADRA/BARBED WHISPER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LADRA/DREADED COMEDY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LADRA/SMOOTH FLOW.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/BRAINSTORM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/GHOSTLY GUILE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/GREEN FURY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/LACQUERED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/LIKE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/NO TE PIERDAS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/ONYX ECHO.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/REACTIVE OVERLOAD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/RETRO.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/SANCTIFIER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/SEGMENT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/SHOWPIECE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/STAR TRAVELER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LR 7.62/STRATAGEM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LW31A1 FROSTLINE/BACON COVERED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LW31A1 FROSTLINE/BALLISTICS BREAKER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LW31A1 FROSTLINE/CRACK SHOT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LW31A1 FROSTLINE/DEVILS PLAYGROUND.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LW31A1 FROSTLINE/DOOBIE WRECK.jpg', type: 'image'},
    { url: 'assets/blueprints/images/LW31A1 FROSTLINE/HELM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MAELSTROM/BRUSH DRUM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MAELSTROM/CHATTER TEETH.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MAELSTROM/FUDGEY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MAELSTROM/FURYSTORM.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MAELSTROM/HALFPIPE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MAELSTROM/ICEBOX.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MAELSTROM/PARTY ETIQUETTE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MAELSTROM/QUIET DOWN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MAELSTROM/RIFF RIPPER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MAELSTROM/SHUFFLE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/BIG BOOMER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/BLACKCELL BOOMSLANG.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/BOOMSLANG.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/EXHUMER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/HARD REBOOT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/HELLISH ARTIFACT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/JURISDICTION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/QUIETUDE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/THE BASTION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/TRENCH WRECKER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/UNREPENTANT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MARINE SP/WRAPPED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/AETHERBURST.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/ASPHALT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/BREACHER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/BULLION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/COBWEB.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/CORRUPTED SÉANCE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/DONT SPEAK.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/EDWARD RETURNS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/PACIFICATION METHOD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/PSYCHO SNAKE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/RAZOR FOX.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/ROBOTIC NINJA.jpg', type: 'image'},
    { url: 'assets/blueprints/images/MODEL L/WARRIORS BLOOD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/NAIL GUN/FLOW PIERCER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/NAIL GUN/RETCON.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/BAD ATTITUDE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/BECQUEREL MONITOR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/BLACKCELL CLOSE RANGE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/CARRION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/ENIGMA TECH.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/ERODER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/FLAMEWARE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/HARD RIGHT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/JUDGMENT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/KILLER RESOLVE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/MIRE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/OCCULT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/PSYCHEDELIC.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/RAT-O-MATIC.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PP-919/STRAINED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PPSH-41/BLACKCELL GLOOMNOUGHT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PPSH-41/CAUTION HANDLER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PPSH-41/EGG BREAKER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PPSH-41/FIERCE STARE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PPSH-41/GLOOMNOUGHT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PPSH-41/JESTER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PPSH-41/ON THE DL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PPSH-41/REEF HUNTER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PU-21/CRAFTED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PU-21/HOG WILD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PU-21/ILL WIND.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PU-21/IRON FIST.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PU-21/MYTH HORSE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PU-21/OXBLOOD.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PU-21/RAMIFICATIONS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/PU-21/UNEARTHER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/BLACKCELL SALUTATIONS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/BOSS ORDERS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/DESECRATION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/EXHUMATION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/INKSPINE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/MARBLED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/MECHA-DRAKE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/SALUTATIONS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/SCRATCH ONE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/SEASONED SCOUT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SAUG/STRIKING DISTANCE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SIRIN 9MM/ABRE ALAS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SIRIN 9MM/DEBT COLLECTOR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/STRYDER .22/CONTRA-BANNED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/STRYDER .22/PREY STALKER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/STRYDER .22/QUICK MERCY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/STRYDER .22/REMAIN SILENT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SVD/AXEL.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SVD/BRAINPLOW.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SVD/DARKFLARE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SVD/FLOATIN AROUND.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SVD/FORCED RETREAT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SVD/LOVELESS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SVD/MAX DAMAGE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SVD/PIXEL PRECISE!.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SVD/SCORCHER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SWAT 5.56/LITHIUM FIRE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SWAT 5.56/NIGHTCLEAVER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SWAT 5.56/QUIP.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SWAT 5.56/REINFORCER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SWAT 5.56/VIOLET ENGRAVING.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SWAT 5.56/VOID.jpg', type: 'image'},
    { url: 'assets/blueprints/images/SWAT 5.56/WATCH AND LEARN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/BLACKCELL NOVABURST.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/BROKEN SILENCE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/CATS CLAW.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/DECK CUTTER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/FISSION.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/NOVABURST.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/PROXIMA.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/PUNKER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/QUANTUM REAVER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/RIPTEAR.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/SHADOWED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/STINGFERNO.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TANTO .22/THORN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TR2/CUT OUT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TR2/HUMBLE BRAG.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TR2/OLD TIMER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TSARKOV 7.62/AEROBRAKE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TSARKOV 7.62/BLACKCELL FURIOUS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TSARKOV 7.62/BUILT TOUGH.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TSARKOV 7.62/C-THRU.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TSARKOV 7.62/DOGBITE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TSARKOV 7.62/FEEDBACK LOOP.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TSARKOV 7.62/FURIOUS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TSARKOV 7.62/RITUALS PATH.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TSARKOV 7.62/SUBSCRIBE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/TSARKOV 7.62/WEED FEED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/ATOMIC COMMANDO.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/BEWARE OF DOG.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/BLACKCELL ENERGY SIPHON.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/BLACKCELL WILD MANNERED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/BUG SMASHER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/CONDUIT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/GUMBALL BALLISTICS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/HIGH AUTHORITY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/PLUNDERGUT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/RAZOR BURN.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/SHARED FATE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/SPEEDWAY.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/VENOMER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/VILE TRIBUTE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XM4/WILD MANNERED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XMG/BATUQUE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XMG/BLOODY WATER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XMG/CHAIN DRIVE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XMG/DISMEMBERER.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XMG/ESPIONAGE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XMG/GET WIPED.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XMG/GREEN MACHINE.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XMG/HAUNTED PORTRAIT.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XMG/HOCUS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/XMG/IDLE HANDS.jpg', type: 'image'},
    { url: 'assets/blueprints/images/download (1).png', type: 'file'},
    { url: 'assets/blueprints/images/download (2).png', type: 'file'},
    { url: 'assets/blueprints/images/download.png', type: 'file'},
    { url: 'assets/blueprints/images/MWIII_2023.png', type: 'file'},
    { url: 'assets/blueprints/images/WarzoneLogoYellow.png', type: 'file'},
    ];

      const messageQueue = [];
      let isProcessingQueue = false;
      let explicitResourcesLoadedCount = 0;
      const totalExplicitResources = assetsToLoad.length;

      function getFileNameFromUrl(url) {
          try {
              const urlObj = new URL(url);
              const path = urlObj.pathname;
              return path.substring(path.lastIndexOf('/') + 1);
          } catch (e) {

              return url.substring(url.lastIndexOf('/') + 1);
          }
      }

      function enqueueMessage(message) {
          if (message) {
              messageQueue.push(message);
              if (!isProcessingQueue) {
                  processMessageQueue();
              }
          }
      }

      function processMessageQueue() {
          if (messageQueue.length > 0) {
              isProcessingQueue = true;
              const message = messageQueue.shift();
              loadingAssetText.innerHTML = message;
              console.log(`Displayed asset loading text: ${message}`);
              setTimeout(() => {
                  processMessageQueue();
              }, loadingMessageDisplayDelay);
          } else {
              isProcessingQueue = false;
          }
      }

      function updateProgressBar() {
        const progress = (explicitResourcesLoadedCount / totalExplicitResources) * 100;
        loadingBar.style.width = progress + '%';
        loadingText.textContent = `.. Fetching ${Math.round(progress)}%`;
        console.log(`Progress: ${Math.round(progress)}%, Current Loaded count: ${explicitResourcesLoadedCount}`);
      }

      function loadAsset(asset) {
          return new Promise(resolve => {
              const fileName = getFileNameFromUrl(asset.url);
              enqueueMessage(`<strong>.. Fetching</strong> - ${fileName}`);

              const markAsLoaded = (status) => {
                  explicitResourcesLoadedCount++;
                  updateProgressBar();
                  enqueueMessage(`${fileName}: <strong>${status}</strong>`);
                  resolve();
              };

              if (asset.type === 'image') {
                  const img = new Image();
                  img.onload = () => {
                      if (asset.url === loadingLogo.src) {
                          loadingLogo.style.opacity = '1'; 
                      }
                      markAsLoaded('Loaded');
                  };
                  img.onerror = () => {
                      console.warn(`Failed to load image: ${fileName}`);
                      markAsLoaded('Failed');
                  };
                  img.src = asset.url;
              } else if (asset.type === 'video') {
                  if (videoElement && asset.url.includes('wallpaper.mp4')) {
                      const videoLoadHandler = () => {
                          markAsLoaded('Loaded');
                          videoElement.removeEventListener('canplaythrough', videoLoadHandler);
                          videoElement.removeEventListener('loadeddata', videoLoadHandler);
                          videoElement.removeEventListener('error', videoErrorHandler);
                      };
                      const videoErrorHandler = () => {
                          console.warn(`Failed to load video: ${fileName}`);
                          markAsLoaded('Failed');
                          videoElement.removeEventListener('canplaythrough', videoLoadHandler);
                          videoElement.removeEventListener('loadeddata', videoLoadHandler);
                          videoElement.removeEventListener('error', videoErrorHandler);
                      };

                      videoElement.addEventListener('canplaythrough', videoLoadHandler, { once: true });
                      videoElement.addEventListener('loadeddata', videoLoadHandler, { once: true });
                      videoElement.addEventListener('error', videoErrorHandler, { once: true });

                      if (videoElement.readyState >= 4) { 
                          markAsLoaded('Cached');
                      } else {
                          videoElement.load();
                      }
                  } else {

                      console.warn(`Skipping video asset tracking for: ${fileName} (not background video or element not found)`);
                      markAsLoaded('Skipped'); 
                  }
              } else if (asset.type === 'css' || asset.type === 'js') {

                  fetch(asset.url)
                      .then(response => {
                          if (response.ok) {
                              markAsLoaded('Parsed/Fetched');
                          } else {
                              console.warn(`Failed to fetch ${asset.type}: ${fileName}`);
                              markAsLoaded('Failed to fetch');
                          }
                      })
                      .catch(error => {
                          console.warn(`Error fetching ${asset.type}: ${fileName}`, error);
                          markAsLoaded('Error');
                      });
              } else if (asset.type === 'font') {

                  document.fonts.ready.then(() => {

                      markAsLoaded('Loaded');
                  }).catch(() => {
                      console.warn(`Font loading issue for: ${fileName}`);
                      markAsLoaded('Failed');
                  });
              } else {

                  fetch(asset.url)
                      .then(response => {
                          if (response.ok) {
                              markAsLoaded('Loaded');
                          } else {
                              console.warn(`Failed to load asset: ${fileName}`);
                              markAsLoaded('Failed');
                          }
                      })
                      .catch(error => {
                          console.warn(`Error loading asset: ${fileName}`, error);
                          markAsLoaded('Error');
                      });
              }
          });
      }

      function loadAllAssetsSequentially() {
          console.log('loadAllAssetsSequentially function called.');
          let p = Promise.resolve();
          assetsToLoad.forEach(asset => {
              p = p.then(() => loadAsset(asset));
          });
          return p;
      }

      updateProgressBar(); 

      loadAllAssetsSequentially().then(() => {
          console.log('All assets loaded function completed.');
          enqueueMessage('All assets: <strong>Complete</strong>');
          setTimeout(() => {
              loadingScreen.style.opacity = '0';
              setTimeout(() => {
                  loadingScreen.style.display = 'none';
                  document.body.style.overflow = 'auto';
                  mainContent.style.display = 'block';
                  mainContent.style.opacity = '1';
                  videoBackground.style.visibility = 'visible';
                  videoBackground.style.opacity = '1';
                  if (videoElement) {
                      videoElement.play().catch(error => {
                          console.warn('Video autoplay prevented after load:', error);
                      });
                  }
              }, 1000);
          }, loadingMessageDisplayDelay);
      }).catch(error => {
          console.error('An error occurred during asset loading:', error);
          enqueueMessage('Asset loading: <strong>Error occurred!</strong>');
          setTimeout(() => {
              loadingScreen.style.opacity = '0';
              setTimeout(() => {
                  loadingScreen.style.display = 'none';
                  document.body.style.overflow = 'auto';
                  mainContent.style.display = 'block';
                  mainContent.style.opacity = '1';
                  videoBackground.style.visibility = 'visible';
                  videoBackground.style.opacity = '1';
                  if (videoElement) {
                      videoElement.play().catch(error => {
                          console.warn('Video autoplay prevented after load (fallback):', error);
                      });
                  }
              }, 1000);
          }, loadingMessageDisplayDelay);
      });
    });