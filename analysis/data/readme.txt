* Process done to Batch*.csv (exported from Mturk)
- Fill empty cell with "NA"
- In column "degree", replace "," with "/"
- In column "keyword", replace "," with "/"
- Remove last two columns to make number of columns be 32


* Process done to auction-war-solo-users*.csv (exported from DynamoDB)
- Nothing needed to be done


* Note
- There's duplicated data in Batch*.csv (people playing multiple times), but not in auction-war-solo*.csv
  Solution: a) have a post process script that checks people who cheated and reject them
            b) mention in the instruction not to play twice
- Mapping between auction-war-solo*.csv to Batch*.csv should be according to game reward code
  Mturk data has correct turker id but might have duplicated turker id
  Dynamodb data has correct unique game reward code and unique player id (which might not be matching turker id)
- There's still missing mapping between Mturk and Dynamodb, both in terms of id and game reward
  Maybe the user didn't really submit the study result?
- Demographic data is not enforced, fix in next batch
- Put too much money in one HIT, reduce it to 30 cents
- There's bunch of action sequence start with index 1, not sure if it's a UI issue or just a behavior
- Longest sequence contains 10 actions, it should be 9 actions, there's a bug in the code when human player starts first, delete last action in this case