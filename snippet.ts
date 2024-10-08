export function calculateScores(
  teamResults: { [key: string]: TeamResults },
  userTeams: UserTeams[],
  scoringRules: ScoringRules,
  topScorerTeam?: string,
  groupWinners?: GroupWinner[],
  earliestGoal? :Goal,
  latestGoal?: Goal
): Scores[] {
  return userTeams.map((user) => {
    const t1Results = teamResults[user.team1Id];
    const t2Results = teamResults[user.team2Id];

    const t1Id = user.team1Id;
    const t2Id = user.team2Id;

    const t1Score = t1Results.wins * scoringRules.t1Win + t1Results.draws * scoringRules.t1Draw
            + t1Results.cleanSheets * scoringRules.cleanSheet
            + t1Results.redCards * scoringRules.redCard
            + t1Results.ownGoals * scoringRules.ownGoal;

    const t2Score = t2Results.wins * scoringRules.t2Win + t2Results.draws * scoringRules.t2Draw
            + t2Results.cleanSheets * scoringRules.cleanSheet
            + t2Results.redCards * scoringRules.redCard
            + t2Results.ownGoals * scoringRules.ownGoal;

    const goldenBootWinner = t1Id === topScorerTeam?.toString()
    || t2Id === topScorerTeam?.toString();

    const t1GroupWinner = groupWinners?.some((winner) => winner.teamId.toString() === t1Id);
    const t2GroupWinner = groupWinners?.some((winner) => winner.teamId.toString() === t2Id);

    const groupWinnerScore = (t1GroupWinner ? scoringRules.t1WinGroup : 0)
    + (t2GroupWinner ? scoringRules.t2WinGroup : 0);

    const scoredEarliestGoal = t1Id === earliestGoal?.team.toString()
     || t2Id === earliestGoal?.team.toString();
    const scoredLatestGoal = t1Id === latestGoal?.team.toString()
     || t2Id === latestGoal?.team.toString();

    return {
      name: user.name,
      score: t1Score + t2Score,
      goldenBoot: goldenBootWinner ? scoringRules.goldenBoot : 0,
      groupWinner: groupWinnerScore,
      earliestGoal: scoredEarliestGoal ? scoringRules.fastestGoal : 0,
      latestGoal: scoredLatestGoal ? scoringRules.latestGoal : 0,
    };
  });