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
mkdir secrets
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

## Running in development mode

CUBE can be launched with all services having their ports exposed by using the additional `docker-compose-dev.yml` file to override the base one:

```sh
docker compose -f docker-compose.yml -f docker-compose-dev.yml up
```

This will not run the `web` container by default.