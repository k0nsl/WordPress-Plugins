<table>
    <tr>
        <td style="width:200px;">
            <?php foreach ($this->files as $i => $file) { ?> 
                    <?php print $i+1 ?>:
                    <a href="<?php print $this->url(array('file' => $file)) ?>"><?php print $file ?></a><br>
            <?php } ?>
        </td>
        <td>
            <?php print $this->data ?>
        </td>
    </tr>
</table>

