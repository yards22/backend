export interface ScoreItem{
    match_id: string,
    owner_id:number,
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
        extra_type?:string, 
      },
      runs_details:{
        runs_scored:number,
        is_boundary?:boolean,
        boundary_type?:string,
        scored_by:string,
        wagon_direction?:string,
       },
       wicket_details:{ 
        is_wicket:boolean,
        wicket_type?:string,
        wicket_of?:string,
        wicket_by?:string,
        is_fielder?:boolean,
        fielded_by?:string,
      }

}

export interface MatchSetupDetails{
    owner_id:number,
    visitor_team:string,
    host_team:string,
    total_overs:number,
    venue:string,
    toss_details:{
        toss_won_by:string,
        opted_to:string
    },
    players_in_action:{
       bowler:IBowler,
       striker_batsman:IBatsman,
       non_striker_batsman:IBatsman,
    }
}

export interface IBatsman{
  name:string,
  runs:number,
  balls:number,
  fours:number,
  sixes:number,
  strike_rate:number,
  is_strike:boolean,
  is_non_strike:boolean,
  wicket_type ?: string,
  fielder_in_action ?:string
}

export interface IBowler{
  name:string,
  overs:number,
  balls:number,
  maiden:number,
  runs:number,
  wicket:number,
  nb:number,
  wd:number,
  economy:number,
  is_cur_bowler:boolean
}

export interface IExtras{
  wd:number,
  nb:number,
  byes:number,
  legbyes:number
}

export interface ITotal{
  runs:number,
  wickets:number,
  overs:number,
  balls:number
}


export interface ScoreCardCommentry{
  batsman:{
    A:IBatsman,
    B:IBatsman
  }
  bowler:{
    A:IBowler,
    B:IBowler
  }
  extras:IExtras,
  previous_balls:Array<number>
  description:Array<string>
}

export interface ScoreCard{
  batter:Array<IBatsman>,
  bowler:Array<IBowler>,
  fall_of_wicket:Array<string>,
  extras:IExtras,
  total:ITotal
}

export interface ScoreCardSummary{
    match_id:string,
    owner_id:number,
    venue:string,
    date:Date,
    teams:{
      team_a:{
        name:string,
        runs:number,
        wickets:number,
        is_batting:boolean
      },
      team_b:{
        name:string,
        runs:number,
        wickets:number,
        is_batting:boolean
      },
    }
    total_overs:number,
    toss_details:{
        toss_won_by:string,
        opted_to:string
    },
    match_status:{
      is_live:boolean,
      result:{
        winning_team:string,
        losing_team:string
      }
    }
    innings_details:{
      is_first_innings:boolean,
      is_second_innings:boolean,
      target:number,
      cur_rr:number,
      req_rr:number,
    }
}