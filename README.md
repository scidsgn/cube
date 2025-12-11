> [!IMPORTANT]
> 🚧 **UNDER HEAVY DEVELOPMENT** 🚧
> 
> CUBE is *not* ready for primetime yet. Expect bugs, schema changes, and movements happening left and right.
> 
> Deploy at your own risk.

# CUBE

NAS software?

## Deployment

**Warning:** nowhere near ready

You will need a key pair for JWT signing:

```sh
mdkir secrets
cd secrets
openssl genrsa -out keypair.pem 2048
openssl rsa -in keypair.pem -pubout -out publickey.crt
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in keypair.pem -out pkcs8.key
```

In `docker-compose.yml` change the path to your media folder - replace instances of `/CHANGE/THIS/MEDIA/FOLDER` to your desired path.

Finally, run `docker compose up` and pray it works!