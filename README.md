# @AutoSource
A few years ago I started working on a program designated for the use of managing schedules for our Christian Congregation Meetings.

This software became whats now know as **[My Kingdom Hall Info](https://mykhinfo.com)**. This software makes it easy to create schedules and edit them on the fly. The only issue is that without the *Meeting Workbooks* from **[JW.org](https://jw.org)** that provide the source material for the week of a students assignments.

> As Jehovah's witnesses, the highlight of out lives are living to do his will. This includes our weekly meetings where we participate and enjoy student assignments. These assignments are given weeks in advance... often times they are posted on a big board for our accessibility.

## - Welcome: @AutoSource

My day used to involve going online and manually copying source material from one site to another, just to save in a database...

number one rule of any programmer is to not do duplicate work. So i decided to create a program to do what i did every few weeks.

	npm install -g autosource

**@AutoSource**, was created to do what i couldn't by hand -

 - Take a .EPUB file containing all the source material and then extract
   it all in under 5 seconds.

- Then convert the data to .JSON (a format thats human readable)

- Finally, upload that newly created .JSON file to my database, where it could be used by the WORLD!!!!

**HOW DO I USE THIS LIFE *SAVING TOOL***???

	autosource init

The **@autosource>init** command sets up the appropriate files structure.

 - @import (folder)
	 -  Where to put downloaded *Meeting Workbook .EPUB*
	
 - @output (folder)
	 - Where file is converted (Don't worry about this...)
 - @json (folder)
	 - Where the .JSON files are created and stored
 - @log (folder)
	 - Supposed to log stuff (I'll finish this later, I promise)


 ### Steps to success :)
 1. Download .EPUB Meeting Workbooks From **[JW.org](https://jw.org)**
 2. Move downloaded files to **@import** folder
 3. Run **@AutoSource>output** command

		autosource output
4. Run **@AutoSource>convert** command to generate .JSON

		autosource convert

### That's it guys and gals, HAVE FUN!!!