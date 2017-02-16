---
layout: post.hbs
lang: en
deck: Kubernetes
title: Manage Kubernetes secrets with SOPS
intro: > 
    Secrets in Kubernetes are strings encoded in Base64, to avoid having to escape special characters in YAML files, but Base64 is by no means a way to store them securely. While there are tools like [Hashicorp's Vault](https://www.vaultproject.io/) to encrypt and decrypt secrets, they have a steep learning curve for beginners and can lead to unnecessary complexity, especially in the beginning of a project. An easy alternative to get started can be Mozilla's CLI tool »SOPS«.
date: 2017-02-16
---

[SOPS](https://github.com/mozilla/sops) is an editor of encrypted files written in Go, that supports YAML, JSON and binary formats. For encryption, you can choose between AWS Key Management Service and PGP. There are pre-build packages for Homebrew on macOS, as well rpm and deb for Linux, or if you have Go installed, you can grab the code with `go get -u go.mozilla.org/sops/cmd/sops`.

## Encrypting a Kubernetes secret file with SOPS

This is a simple example for a typical Kubernetes secret description in YAML:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  key: dmFsdWU= # "value" in base64
```

The secret is encoded as Base64 string using `echo -n "value" | base64 -`.

If you are using Amazon Web Services, it's convenient to use their Key Management Service (KMS) to encrypt the file, as you can restrict access to dedicated users or roles. To use SOPS with a KMS key, run:

```bash
sops --kms="<your kms key>" --encrypt mysecret.yaml > mysecret.sops.yaml
```

SOPS walks through every key of the YAML file and encrypt its' value. The result will look like this:

```yaml
apiVersion: ENC[AES256_GCM,data:Ww8=,iv:2hdl1qLqXUXV02NZgB0CL3iRIDPXRQo3Rh2EFkIedEw=,tag:czTAZAliyC7wWdhzsl9zNA==,type:str]
kind: ENC[AES256_GCM,data:zCdSmw8s,iv:mkkDmSsLgn6cDk09IoFmONQ6eOZ8QdVnIrxOZeXHQU0=,tag:jFJfwDlby0sNBOkrnsxL5w==,type:str]
metadata:
    name: ENC[AES256_GCM,data:5J/x68hZxWI=,iv:wTxlcCqoaCkKL2DAcTqcdDQW169F6Z50JQh2tpBFT3Y=,tag:rnKR021UOAhqxCwmyK6cmA==,type:str]
type: ENC[AES256_GCM,data:J78DPI4R,iv:Cs8chlV3WYYNDqNMVQB84DcEnG9suM57EwWOp3q2U/E=,tag:uJTAO5weY3c41/ak7qN1uA==,type:str]
data:
    key: ENC[AES256_GCM,data:daD5ymYKSaA=,iv:mCWzCqIdOnnYKvO2dqegUMLj9Yk6JrzdxdLjrzQH8yI=,tag:/QUTfDskQyvOxsoW6kHuxQ==,type:str]
sops:
    kms:
    -   <your kms key>
        created_at: '2017-02-14T08:59:38Z'
        enc: AQECAHi1ftWP7VUfQejjgJWiKVy7IKOHEWrrHp3o835lnx0P6wAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDHJnBcRg7mi9a2ElTgIBEIA7/FGNDVlnFN0A3D2HYPLVuB2+qMFuSCwbjYe8gIeWFYcH0p1DEqCqVv2KMV7hrBe0b8bl36849sE8oNw=
    lastmodified: '2017-02-14T08:59:38Z'
    mac: ENC[AES256_GCM,data:cc/txSNVoDR9wo3OPXvb6p5dEtc+owY1SaFLMUb5GW6Sgi5MJfX4HUPWT/Okc249WeYAC7iWctX6Nw66KwbAaJIBOF3EbWDizGRbYm/DWtmg1/W7uzzcMrTfUdZD1gNeVxrrYQv5xPJSFlSQPAFiUeCOQIfRHSswTE+Bbzb8Bw8=,iv:yXeBAzyn/TB2RN1vOh4nu0WYkdReyYDC/NmDST7WgB4=,tag:2FW8T8Qf9I24tFLmmGlD4A==,type:str]
    pgp: []
    unencrypted_suffix: _unencrypted
    version: 2.0.7
```

You can now safely store this file along your code, as it can only be decrypted with access to the KMS key.

The best way to push the secret to your Kubernetes cluster is piping it directly to `kubectl` to avoid storing the decrypted secret somewhere temporarily during the transit:

```bash
sops --decrypt mysecret.sops.yaml | kubectl apply -f -
```


## A step further

The encoded example above is a bit noisy, as every YAML key is encrypted by default, not only those lines containing the actual secrets. While it's not perfect, you can add `_unencrypted` suffix to each key you don't want SOPS to encrpyt (e.g. `metadata_unencrypted`). Those keys and their child nodes will be ignored in the future. But this also requires a little additional step inbetween to get rid of those suffixes again, before pushing the secret to Kubernetes:

```bash
sops --decrypt mysecret.sops.yaml | sed 's|_unencrypted||g' | kubectl apply -f -
```


## Conclusion

SOPS gives you an easy way to store secrets securely in your Kubernetes YAML descriptions. It's fast and doesn't require any other dependencies. This makes it a solid starting point for your project before you may consider more complex secret management solutions.
