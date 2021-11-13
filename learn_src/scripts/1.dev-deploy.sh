#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 1: Build the contract (may take a few seconds)"
echo ---------------------------------------------------------
echo

yarn build:release

echo
echo
echo ---------------------------------------------------------
echo "Step 2: Deploy the contract"
echo
echo "(edit scripts/1.dev-deploy.sh to deploy other contract)"
echo ---------------------------------------------------------
echo

# comment out the line below to deploy the other example contract
# near dev-deploy ./build/release/ngo.wasm
near deploy --accountId $OWNER --wasmFile ./build/release/ngo.wasm

# uncomment the line below to deploy the other example contract
# near dev-deploy ./build/release/singleton.wasm

echo --------------------------------------------
echo
echo "creating a user subaccount"
echo
dir_path=$(dirname $(realpath $0))
counter=$(cat $dir_path/../db/id_counter)
echo $((counter+=1)) > $dir_path/../db/id_counter
export user1=user$counter.$OWNER
near create-account $user1 --masterAccount $OWNER


echo
echo
echo ---------------------------------------------------------
echo "Step 3: Prepare your environment for next steps"
echo
echo "(a) find the contract (account) name in the message above"
echo "    it will look like this: [ Account id: dev-###-### ]"
echo
echo "(b) set an environment variable using this account name"
echo "    see example below (this may not work on Windows)"
echo
echo ---------------------------------------------------------
echo 'export CONTRACT=<dev-123-456>'
# uncomment this line for a useful hint when using the singleton style
# echo "near call \$CONTRACT init --accountId \$CONTRACT"
echo ---------------------------------------------------------
echo

exit 0
