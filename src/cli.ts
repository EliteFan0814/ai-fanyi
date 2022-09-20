#!/usr/bin/env node
import { Command } from "commander";
import { translate } from "./main";
const program = new Command();
program
  .name("aify")
  .version("0.0.1")
  .description("翻译命令行工具，自动识别语言，默认翻译为中文");

program
  .argument("<transFrom>", "<填写需要翻译的文字>，默认翻译为中文")
  .action((transFrom) => {
    translate(transFrom);
  });
program
  .command("en <transFromWord>")
  .description("翻译为英文")
  .action((source) => {
    translate(source, "en");
  });
program
  .command("zh <transFromWord>")
  .description("翻译为中文")
  .action((source) => {
    translate(source, "zh");
  });
program.parse(process.argv);
