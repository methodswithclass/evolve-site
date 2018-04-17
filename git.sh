cd #!/bin/bash


cd /home/cpolito/@stuff/@programs/evolve1

message="$1"
remote="$2"
branch="$3"


git add -A && git commit -m $message
git push $remote $branch
