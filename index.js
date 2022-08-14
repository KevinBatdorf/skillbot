#!/usr/bin/env node
"use strict";
require("dotenv").config({ path: ".env" });
const irc = require("irc");
const fetch = require("node-fetch");
const get = require("lodash/get");

const clientLibera = new irc.Client("irc.libera.chat", "skillbot", {
  channels: ["#theskillwithin"],
  userName: "skillbot",
  realName: "skillbot",
});

const registerLibra = () => {
  clientLibera.say("NickServ", `IDENTIFY skillbot ${process.env.IDENTIFY}`);

  setTimeout(() => {
    clientLibera.join("#theskillwithin");
    clientLibera.join("#javascript");
    clientLibera.join("##ketochat");
    clientLibera.join("#gatsbyjs");
    clientLibera.join("#nextjs");
    clientLibera.join("#reactjs");
    clientLibera.join("#css");
    clientLibera.join("#severance");
    clientLibera.join("#typescript");
  }, 10000);
};

const ignoreList = ["skillbot", "jellobot", "ecmabot"];

clientLibera.addListener("registered", registerLibra);

const greekQuestionMark = (from, message, channel, c) => {
  if (/\u037E/g.test(message)) {
    c.say(
      channel,
      `Warning! ${from}: You have used a greek question mark(u037E) instead of a semicolon(u003B)!`
    );
  }
};

// const convertSecondsToTime = (givenSeconds) => {
//   const dateObj = new Date(givenSeconds * 1000);
//   const hours = dateObj.getUTCHours();
//   const minutes = dateObj.getUTCMinutes();
//   const seconds = dateObj.getSeconds();

//   const time = `${hours
//     .toString()
//     .padStart(2, "0")}:${minutes
//     .toString()
//     .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

//   return time;
// };

const getYoutubeId = (message) => {
  const regexp =
    /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed|shorts\/|v\/)?)(?<id>([\w\-]+)(\S+)?)/g;
  const exec = regexp.exec(message);
  return exec && exec.groups && exec.groups.id;
};

const youtubeURL = (id) =>
  `https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${id}&key=${process.env.YOUTUBE}`;

const youtubeTitle = async (from, message, channel, c) => {
  const id = getYoutubeId(message);
  if (id) {
    const splitTimeFromId = id.split("?t=");

    const idWithoutTime = splitTimeFromId[0];

    // const time = splitTimeFromId[1] && convertSecondsToTime(splitTimeFromId[1]);

    await fetch(youtubeURL(idWithoutTime), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((res) => {
        const title = get(res, "items[0].snippet.title", false);
        if (title) {
          c.say(channel, `YouTube Title: ${title}`);
        }
        // if (/Rick Astley/gi.test(title)) {
        //   client.say(
        //     channel,
        //     `Warning! ${from}: That video may possibly be a Rick Roll!`
        //   );
        // }
      });
  }
};

const isModToHalf = (number) => {
  const mod = number % 1;

  const isModToHalf = mod > 0.25 && mod < 0.75;

  return isModToHalf;
};

const isModToQuarterUp = (number) => {
  const mod = number % 1;

  const isModToQuarterUp = mod > 0.75;

  return isModToQuarterUp;
};

const thankYouMayIHaveAHandShake = (from, message, channel, c) => {
  if (message.toLowerCase().includes("thank you may i have a handshake")) {
    return c.say(channel, `/me shakes ${from} hand`);
  }
};

const calcWeight = (from, message, channel, c) => {
  if (message.charAt(0) === ">") {
    const kiloPoundsConversionNumber = 2.20462;

    const matchKilosToPounds = message.match(/^>k2p (\d{1,9}?[.]?\d{0,4})$/);

    if (matchKilosToPounds) {
      const kilos = parseFloat(matchKilosToPounds[1]);

      const pounds = kilos * kiloPoundsConversionNumber;

      const isPoundsModToHalf = isModToHalf(pounds);
      const isPoundsModToQuaterUp = isModToQuarterUp(pounds);

      const truncPounds = Math.trunc(pounds);
      return c.say(
        channel,
        `${kilos} kilos is about ${
          isPoundsModToQuaterUp ? truncPounds + 1 : truncPounds
        }${isPoundsModToHalf ? " and a half" : ""} pounds`
      );
    }

    const matchPoundsToKilos = message.match(/^>p2k (\d{1,9}?[.]?\d{0,4})$/);

    if (matchPoundsToKilos) {
      const pounds = matchPoundsToKilos[1];

      const kilos = pounds / kiloPoundsConversionNumber;

      const isKilosModToHalf = isModToHalf(kilos);
      const isKilosModToQuaterUp = isModToQuarterUp(kilos);

      const truncKilos = Math.trunc(kilos);
      return c.say(
        channel,
        `${pounds} pounds is about ${
          isKilosModToQuaterUp ? truncKilos + 1 : truncKilos
        }${isKilosModToHalf ? " and a half" : ""} kilos`
      );
    }

    // more precise measurments (expiramental)

    const matchKilosToPoundsExact = message.match(
      /^>k2p! (\d{1,9}?[.]?\d{0,4})$/
    );
    if (matchKilosToPoundsExact) {
      const kilosExact = parseFloat(matchKilosToPoundsExact[1]);

      const poundsExact = kilosExact * kiloPoundsConversionNumber;
      const roundPoundsExact = Math.round(poundsExact * 100) / 100;
      return c.say(
        channel,
        `${kilosExact} kilos is about ${roundPoundsExact} pounds`
      );
    }

    const matchPoundsToKilosExact = message.match(
      /^>p2k! (\d{1,9}?[.]?\d{0,4})$/
    );

    if (matchPoundsToKilosExact) {
      const poundsExact = matchPoundsToKilosExact[1];

      const kilosExact = poundsExact / kiloPoundsConversionNumber;
      const roundKilosExact = Math.round(kilosExact * 100) / 100;
      return c.say(
        channel,
        `${poundsExact} pounds is about ${roundKilosExact} kilos`
      );
    }
  }
};

clientLibera.addListener("message#theskillwithin", (from, message) => {
  if (!ignoreList.includes(from.toLowerCase())) {
    greekQuestionMark(from, message, "#theskillwithin", clientLibera);
    youtubeTitle(from, message, "#theskillwithin", clientLibera);
    calcWeight(from, message, "#theskillwithin", clientLibera);
    thankYouMayIHaveAHandShake(from, message, "#theskillwithin", clientLibera);
  }
});

clientLibera.addListener("message##ketochat", (from, message) => {
  if (!ignoreList.includes(from.toLowerCase())) {
    youtubeTitle(from, message, "##ketochat", clientLibera);
    calcWeight(from, message, "##ketochat", clientLibera);
  }
});

clientLibera.addListener("message#javascript", (from, message) => {
  if (!ignoreList.includes(from.toLowerCase())) {
    greekQuestionMark(from, message, "#javascript", clientLibera);
    youtubeTitle(from, message, "#javascript", clientLibera);
  }
});

clientLibera.addListener("message#typescript", (from, message) => {
  if (!ignoreList.includes(from.toLowerCase())) {
    greekQuestionMark(from, message, "#typescript", clientLibera);
    youtubeTitle(from, message, "#typescript", clientLibera);
  }
});

clientLibera.addListener("message#nextjs", (from, message) => {
  if (!ignoreList.includes(from.toLowerCase())) {
    greekQuestionMark(from, message, "#nextjs", clientLibera);
    youtubeTitle(from, message, "#nextjs", clientLibera);
  }
});

clientLibera.addListener("message#severance", (from, message) => {
  if (!ignoreList.includes(from.toLowerCase())) {
    greekQuestionMark(from, message, "#severance", clientLibera);
    youtubeTitle(from, message, "#severance", clientLibera);
    thankYouMayIHaveAHandShake(from, message, "#severance", clientLibera);
  }
});

clientLibera.addListener("message#css", (from, message) => {
  if (!ignoreList.includes(from.toLowerCase())) {
    greekQuestionMark(from, message, "#css", clientLibera);
    youtubeTitle(from, message, "#css", clientLibera);
  }
});

clientLibera.addListener("message#reactjs", (from, message) => {
  if (!ignoreList.includes(from.toLowerCase())) {
    greekQuestionMark(from, message, "#reactjs", clientLibera);
    youtubeTitle(from, message, "#reactjs", clientLibera);
  }
});

clientLibera.addListener("pm", function (from, message) {
  clientLibera.say("#theskillwithin", `${from}: ${message}`);
});

clientLibera.addListener("error", (message) => {
  console.error("IRC Error: ", message);
});
