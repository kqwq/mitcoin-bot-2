import { Events, Interaction } from "discord.js";
import { ownerUserId } from "../util/constants";
// import { onModalSubmit } from "../util/modal.js";

export default {
  name: Events.InteractionCreate,
  async execute(
    interaction: Interaction,
    slashCommands: any[],
    contextCommands: any[]
  ) {
    // Modal submit interaction
    if (interaction.isModalSubmit()) {
      console.log("On modal submit lol");
      return;
      // return await onModalSubmit(interaction);
    }

    if (interaction.isMessageContextMenuCommand()) {
      const command = contextCommands.find(
        (cmd) => cmd.data.name === interaction.commandName
      );

      if (!command)
        return console.error(
          `No context command matching ${interaction.commandName} found`
        );

      try {
        // Execute the command
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
      }
    }

    if (interaction.isChatInputCommand()) {
      const command = slashCommands.find(
        (cmd) => cmd.data.name === interaction.commandName
      );

      // // If the command was executed by another user, log it
      // if (interaction.user.id !== OWNER_USER_ID) {
      //   logger.log(
      //     "info",
      //     `${interaction.user.tag} executed ${
      //       interaction.commandName
      //     } with the options: ${interaction.options.data
      //       .map((option) => `${option.name}: ${option.value}`)
      //       .join(", ")}`
      //   );
      // }

      if (!command)
        return console.error(
          `No slash command matching ${interaction.commandName} found`
        );

      try {
        await command.execute(interaction, slashCommands);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    }
  },
};
