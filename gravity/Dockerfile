FROM rust:1.61-bullseye as build

WORKDIR /app

COPY . /app

RUN cargo build --release

FROM gcr.io/distroless/cc as release

COPY --from=build /app/target/release/gravity /

ENTRYPOINT ["./gravity"]
