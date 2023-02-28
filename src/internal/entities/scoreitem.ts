
export interface ScoreItem{
    match_id: string,
    innings_details:{
        innings_id:number,
        overs:number,
        balls:number,
        batting_team:string,
        bowling_team:string,
      },
      players_in_action:{
        bowler:string,
        striker_batsman:string,
        non_striker_batsman:string, 
      },
      extra_details:{
        is_extra:boolean,
        extra_type:string, 
      },
      runs_details:{
        runs_scored:number,
        is_boundary:boolean,
        boundary_type:string,
        scored_by:string,
        wagon_direction:string,
       },
       wicket_details:{ 
        is_wicket:boolean,
        wicket_type:string,
        wicket_of:string,
        wicket_by:string,
        is_fielder:boolean,
        fielded_by:string,
      }

}