include "node_modules/circomlib/circuits/comparators.circom";
include "node_modules/circomlib/circuits/bitify.circom";

template InAuthorizedRange(){

    // Public inputs are the latitude and longitude ranges for an authorized fishing area.
    signal input latitudeRange[2]; // 0->90
    signal input longitudeRange[2]; // 0->180

    signal input location[2];
    signal output out; // 0 or 1

    component gt1 = GreaterEqThan(9);
    gt1.in[0] <== location[0];
    gt1.in[1] <== latitudeRange[0];
    gt1.out === 1; 

    component lt1 = LessEqThan(9);
    lt1.in[0] <== location[0];
    lt1.in[1] <== latitudeRange[1];
    lt1.out === 1;

    component gt2 = GreaterEqThan(9);
    gt2.in[0] <== location[1];
    gt2.in[1] <== longitudeRange[0];
    gt2.out === 1;  

    component lt2 = LessEqThan(9);
    lt2.in[0] <== location[1];
    lt2.in[1] <== longitudeRange[1];
    lt2.out === 1;  

    out <-- (gt1.out + gt2.out + lt1.out + lt2.out) * 1/4;
    out === 1;
}

component main {public [latitudeRange, longitudeRange]} = InAuthorizedRange();