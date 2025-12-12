> [!IMPORTANT]
> 🚧 **UNDER HEAVY DEVELOPMENT** 🚧
> 
> CUBE is *not* ready for primetime yet. Expect bugs, schema changes, and movements happening left and right.
> 
> Deploy at your own risk.

# CUBE

NAS software?

## Deployment

## Generating keys for auth

You will need a pair of RSA keys for JWT signing. Generate them if you don't have them already:

```sh
mdkir secrets
cd secrets
openssl genrsa -out keypair.pem 2048
openssl rsa -in keypair.pem -pubout -out publickey.crt
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in keypair.pem -out pkcs8.key
```

## Setting up deployment variables

Copy over the provided `.env.template` file to a new `.env` file and fill in the necessary fields.

> [!NOTE]
> Make sure your music is in a subdirectory of your media folder, e.g. `./music` inside of `/data/media`.

Finally, run `docker compose up` and pray it works!