/* Services */
angular.module(
    'eu.crismaproject.pilotE.services'
).factory(
    'eu.crismaproject.pilotE.services.poi',
    [   'DEBUG',
        function (DEBUG) {
            'use strict';

            var chestTrauma,
                unconsciousness,
                lowerLegFracture,
                ankleFracture,
                thighFracture,
                whiplashInjury,
                multipleBruice,
                scrape,
                uninjured,
                handSprain,
                //additional patterns:
                multipleTrauma,
                lowerLegAmputation,
                forearmAmputation,
                hyperventilation,
                pelvisFracture,
                craniocerebralInjury;

            var  patternsOfInjuries = {
                chestTrauma : null,
                unconsciousness : null,
                lowerLegFracture : null,
                ankleFracture : null,
                thighFracture : null,
                whiplashInjury : null,
                multipleBruice : null,
                scrape : null,
                uninjured : null,
                handSprain : null,
                //additional patterns:
                multipleTrauma : null,
                lowerLegAmputation : null,
                forearmAmputation : null,
                hyperventilation : null,
                pelvisFracture : null,
                craniocerebralInjury : null
            };
            
            var initPoi = function() {
              
              //possible care measures:
//              1=Ventilation
//              2=Consciousness
//              3=Hemorrhage
//              4=Position
//              5=Warmth preservation
//              6=Attendance
//              7=Supplemental Oxygen
              
              
              chestTrauma = {
                  ventilation : true, //1
                  consciousness : true , //2
                  hemorrhage : false,
                  position : true, //4
                  warmthPreservation: true, //5
                  attendance : true, //6
                  supplementalOxygen : true, //7
                  amount: 6
              };
              
              unconsciousness = chestTrauma;
              
              lowerLegFracture = {
                  ventilation : false,
                  consciousness : true , //2
                  hemorrhage : true, //3
                  position : true, //4
                  warmthPreservation: true, //5
                  attendance : true, //6
                  supplementalOxygen : true, //7
                  amount: 6
              };
              
              ankleFracture = lowerLegFracture;
              
              thighFracture = lowerLegFracture;
              
              whiplashInjury = {
                  ventilation : false,
                  consciousness : true , //2
                  hemorrhage : false,
                  position : true, //4
                  warmthPreservation: true, //5
                  attendance : false,
                  supplementalOxygen : true, //7
                  amount: 4
              };
              
              multipleBruice = {
                  ventilation : false,
                  consciousness : true , //2
                  hemorrhage : false,
                  position : false,
                  warmthPreservation: true, //5
                  attendance : false,
                  supplementalOxygen : true, //7
                  amount: 3
              };
              
              scrape = {
                  ventilation : false,
                  consciousness : true , //2
                  hemorrhage : true, //3
                  position : false,
                  warmthPreservation: true, //5
                  attendance : false,
                  supplementalOxygen : true, //7
                  amount: 4
              };
              
              uninjured = {
                  ventilation : false,
                  consciousness : true , //2
                  hemorrhage : false,
                  position : false,
                  warmthPreservation: false,
                  attendance : false,
                  supplementalOxygen : false,
                  amount: 1
              };
              
              handSprain = multipleBruice;
              
              //additional patterns:
              
              multipleTrauma = {
                  ventilation : true,
                  consciousness : true ,
                  hemorrhage : true,
                  position : true,
                  warmthPreservation: true,
                  attendance : true,
                  supplementalOxygen : true,
                  amount : 7
              };
              
              lowerLegAmputation = lowerLegFracture;
              forearmAmputation = lowerLegFracture;
              
              hyperventilation = {
                  ventilation : false,
                  consciousness : true , //2
                  hemorrhage : false,
                  position : false,
                  warmthPreservation: true, //5
                  attendance : true, //6
                  supplementalOxygen : false,
                  amount: 3
              };
              
              pelvisFracture = {
                  ventilation : false,
                  consciousness : true , //2
                  hemorrhage : false,
                  position : true, //4
                  warmthPreservation: true, //5
                  attendance : true, //6
                  supplementalOxygen : true, //7
                  amount: 5
              };
              
              craniocerebralInjury = multipleTrauma;
              

              patternsOfInjuries.chestTrauma = chestTrauma;
              patternsOfInjuries.unconsciousness = unconsciousness;
              patternsOfInjuries.lowerLegFracture = lowerLegFracture;
              patternsOfInjuries.ankleFracture = ankleFracture;
              patternsOfInjuries.thighFracture = thighFracture;
              patternsOfInjuries.whiplashInjury = whiplashInjury;
              patternsOfInjuries.handSprain = handSprain;
              patternsOfInjuries.multipleBruice = multipleBruice;
              patternsOfInjuries.scrape = scrape;
              patternsOfInjuries.uninjured = uninjured;
              //additional patterns:
              patternsOfInjuries.multipleTrauma = multipleTrauma;
              patternsOfInjuries.lowerLegAmputation = lowerLegAmputation;
              patternsOfInjuries.forearmAmputation = forearmAmputation;
              patternsOfInjuries.hyperventilation = hyperventilation;
              patternsOfInjuries.pelvisFracture = pelvisFracture;
              patternsOfInjuries.craniocerebralInjury = craniocerebralInjury;
              
           };
              
            
            initPoi();
            
            var getPatterns = function(){
              return patternsOfInjuries;
            };
            
            var necessaryMeasuresExecuted = function(identificationOfInjury, executedMeasures){
              var result = true;
              var relevantPattern = null;
            
              if (identificationOfInjury !== null){
                 switch (identificationOfInjury){
                   case 'chestTrauma':
                     relevantPattern = patternsOfInjuries.chestTrauma;
                     break;
                   case 'unconsciousness':
                     relevantPattern = patternsOfInjuries.unconsciousness;
                     break;
                   case 'lowerLegFracture':
                     relevantPattern = patternsOfInjuries.lowerLegFracture;
                     break;
                   case 'ankleFracture':
                     relevantPattern = patternsOfInjuries.ankleFracture;
                     break;
                   case 'thighFracture':
                     relevantPattern = patternsOfInjuries.thighFracture;
                     break;
                   case 'whiplashInjury':
                     relevantPattern = patternsOfInjuries.whiplashInjury;
                     break;
                   case 'multipleBruice':
                     relevantPattern = patternsOfInjuries.multipleBruice;
                     break;
                   case 'scrape':
                     relevantPattern = patternsOfInjuries.scrape;
                     break;
                   case 'uninjured':
                     relevantPattern = patternsOfInjuries.uninjured;
                     break;
                   case 'handSprain':
                     relevantPattern = patternsOfInjuries.handSprain;
                     break;
                   //additional patterns:
                   case 'multipleTrauma':
                     relevantPattern = patternsOfInjuries.multipleTrauma;
                     break;
                   case 'lowerLegAmputation':
                     relevantPattern = patternsOfInjuries.lowerLegAmputation;
                     break;
                   case 'forearmAmputation':
                     relevantPattern = patternsOfInjuries.forearmAmputation;
                     break;
                   case 'hyperventilation':
                     relevantPattern = patternsOfInjuries.hyperventilation;
                     break;
                   case 'pelvisFracture':
                     relevantPattern = patternsOfInjuries.pelvisFracture;
                     break;
                   case 'craniocerebralInjury':
                     relevantPattern = patternsOfInjuries.craniocerebralInjury;
                     break;
                   default:
                     //no match
                     if (DEBUG) {
                       console.log('identificationOfInjury type unknown!');
                     }
                   return false;
               }
               
               if(relevantPattern !== null){
                 if(executedMeasures !== null && executedMeasures.length === 7){
                   for (var i = 0; i < executedMeasures.length; i++) {
                     if(executedMeasures[i] !== null){
                       switch (executedMeasures[i].measure){
                         case 'Ventilation':
                           if(relevantPattern.ventilation){
                             result &= executedMeasures[i].value;
                           }
                           break;
                         case 'Consciousness':
                           if(relevantPattern.consciousness){
                             result &= executedMeasures[i].value;
                           }
                           break;
                         case 'Hemorrhage':
                           if(relevantPattern.hemorrhage){
                             result &= executedMeasures[i].value;
                           }
                           break;
                         case 'Position':
                           if(relevantPattern.position){
                             result &= executedMeasures[i].value;
                           }
                           break;
                         case 'Warmth preservation':
                           if(relevantPattern.warmthPreservation){
                             result &= executedMeasures[i].value;
                           }
                           break;
                         case 'Attendance':
                           if(relevantPattern.attendance){
                             result &= executedMeasures[i].value;
                           }
                           break;
                         case 'Supplemental Oxygen':
                           if(relevantPattern.supplementalOxygen){
                             result &= executedMeasures[i].value;
                           }
                           break;
                         default:
                           //no match
                           if (DEBUG) {
                             console.log('care measure type unknown!');
                           }
                         break;
                       }
                     }
                   }
                 }else {
                   if (DEBUG) {
                     console.warn('executedMeasures was null or executedMeasures.length !== 7!');
                   }
                   return false;
                 }
               }else {
                 if (DEBUG) {
                   console.warn('relevantPattern was null!');
                 }
                 return false;
               }
               
               
             }else {
               if (DEBUG) {
                 console.warn('identificationOfInjury was null!');
               }
               return false;
             }
              
              return result;
            };
            
            
            
            
            return {
                getPatterns : getPatterns,
                necessaryMeasuresExecuted : necessaryMeasuresExecuted
            };
        }
    ]
);
